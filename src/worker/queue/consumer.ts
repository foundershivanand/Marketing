import { DatabaseClient } from '../../lib/database/db';
import { SubmissionWorkflow } from '../workflows/submission.workflow';
import { SubmissionQueueMessage } from './producer';
import { DeadLetterQueueRepository } from '../../lib/database/dlq.repo';
import { DestinationsRepository } from '../../lib/database/destinations.repo';
import { CampaignsRepository } from '../../lib/database/campaigns.repo';
import { logAudit } from '../../lib/audit/logger';

export class QueueConsumer {
  private submissionWorkflow: SubmissionWorkflow;
  private dlqRepo: DeadLetterQueueRepository;
  private destinationsRepo: DestinationsRepository;
  private campaignsRepo: CampaignsRepository;

  constructor(private db: DatabaseClient, private env?: any) {
    this.submissionWorkflow = new SubmissionWorkflow(db, env);
    this.dlqRepo = new DeadLetterQueueRepository(db);
    this.destinationsRepo = new DestinationsRepository(db);
    this.campaignsRepo = new CampaignsRepository(db);
  }

  async processBatch(messages: Array<{ body: SubmissionQueueMessage; ack: () => void; retry: (options?: { delaySeconds?: number }) => void }>): Promise<void> {
    for (const msg of messages) {
      const { targetId, destinationId, campaignId } = msg.body;
      const target = await this.campaignsRepo.findTargetById(targetId);

      // Check destination cooldown & rate limit
      const throttle = destinationId ? await this.destinationsRepo.getThrottle(destinationId) : null;
      if (throttle && throttle.cooldown_until) {
        const cooldownEnd = new Date(throttle.cooldown_until).getTime();
        const now = Date.now();
        if (cooldownEnd > now) {
          const delaySecs = Math.min(300, Math.max(30, Math.round((cooldownEnd - now) / 1000)));
          console.warn(`[QueueConsumer] Destination ${destinationId} is in cooldown. Delaying target ${targetId} for ${delaySecs}s.`);
          msg.retry({ delaySeconds: delaySecs });
          continue;
        }
      }

      // Check max retries (3 attempts threshold)
      const currentAttempts = target?.attempts || 0;
      if (currentAttempts >= 3) {
        console.error(`[QueueConsumer] Max retry threshold exceeded for target ${targetId}. Routing to Dead Letter Queue.`);
        await this.dlqRepo.enqueue({
          queueName: 'launchpilot-submissions',
          targetId,
          campaignId,
          destinationId,
          payload: msg.body,
          errorReason: `Exceeded maximum submission retry limit (${currentAttempts} attempts)`,
          retryCount: currentAttempts,
        });

        await this.campaignsRepo.updateTargetStatus(targetId, 'failed', {
          errorMessage: 'Exceeded maximum automated submission attempts. Moved to DLQ for manual inspection.',
        });

        await logAudit(this.db, {
          action: 'dlq_routed',
          resourceType: 'campaign_target',
          resourceId: targetId,
          details: { campaignId, destinationId, attempts: currentAttempts },
        });

        // Acknowledge so poison message is evicted from active queue
        msg.ack();
        continue;
      }

      try {
        console.log(`[QueueConsumer] Processing submission target: ${targetId} (attempt ${currentAttempts + 1})`);
        const result = await this.submissionWorkflow.executeTargetSubmission(targetId);

        if (result.success || result.requiresIntervention) {
          if (destinationId) {
            await this.destinationsRepo.recordAttemptOutcome(destinationId, true);
          }
          msg.ack();
        } else {
          // Check if rate limited
          const isRateLimited = result.errorMessage?.toLowerCase().includes('rate limit') ||
            result.errorMessage?.includes('429');
          if (destinationId) {
            await this.destinationsRepo.recordAttemptOutcome(destinationId, false, isRateLimited);
          }

          if (isRateLimited) {
            msg.retry({ delaySeconds: 180 }); // 3 min backoff
          } else {
            msg.retry({ delaySeconds: 30 });
          }
        }
      } catch (err: any) {
        console.error(`[QueueConsumer] Unhandled error processing target ${targetId}:`, err);
        if (destinationId) {
          await this.destinationsRepo.recordAttemptOutcome(destinationId, false, false);
        }

        // If approaching max attempts on next cycle, consider routing to DLQ
        if (currentAttempts + 1 >= 3) {
          await this.dlqRepo.enqueue({
            queueName: 'launchpilot-submissions',
            targetId,
            campaignId,
            destinationId,
            payload: msg.body,
            errorReason: `Unhandled exception in worker: ${err.message}`,
            stackTrace: err.stack,
            retryCount: currentAttempts + 1,
          });
          msg.ack();
        } else {
          msg.retry({ delaySeconds: 60 });
        }
      }
    }
  }
}

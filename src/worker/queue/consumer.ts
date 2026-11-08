import { DatabaseClient } from '../../lib/database/db';
import { SubmissionWorkflow } from '../workflows/submission.workflow';
import { SubmissionQueueMessage } from './producer';

export class QueueConsumer {
  private submissionWorkflow: SubmissionWorkflow;

  constructor(db: DatabaseClient, env?: any) {
    this.submissionWorkflow = new SubmissionWorkflow(db, env);
  }

  async processBatch(messages: Array<{ body: SubmissionQueueMessage; ack: () => void; retry: () => void }>): Promise<void> {
    for (const msg of messages) {
      try {
        const { targetId } = msg.body;
        console.log(`[QueueConsumer] Processing submission target: ${targetId}`);
        const result = await this.submissionWorkflow.executeTargetSubmission(targetId);

        if (result.success || result.requiresIntervention) {
          msg.ack();
        } else {
          // Retry failed attempt
          msg.retry();
        }
      } catch (err: any) {
        console.error(`[QueueConsumer] Fatal error processing message:`, err);
        msg.retry();
      }
    }
  }
}

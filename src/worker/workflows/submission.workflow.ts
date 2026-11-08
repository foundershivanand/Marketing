import { DatabaseClient } from '../../lib/database/db';
import { CampaignsRepository } from '../../lib/database/campaigns.repo';
import { DestinationsRepository } from '../../lib/database/destinations.repo';
import { ProductsRepository } from '../../lib/database/products.repo';
import { SubmissionsRepository } from '../../lib/database/submissions.repo';
import { globalAdapterRegistry } from '../../adapters/registry';
import { buildUTMUrl } from '../../lib/tracking/utm';
import { logAudit } from '../../lib/audit/logger';
import { SubmissionResult } from '../../types/submission';

// Active execution lock tracking to avoid concurrent submissions to same target
const executionLocks = new Set<string>();

export class SubmissionWorkflow {
  private campaignsRepo: CampaignsRepository;
  private destinationsRepo: DestinationsRepository;
  private productsRepo: ProductsRepository;
  private submissionsRepo: SubmissionsRepository;

  constructor(private db: DatabaseClient, private env?: any) {
    this.campaignsRepo = new CampaignsRepository(db);
    this.destinationsRepo = new DestinationsRepository(db);
    this.productsRepo = new ProductsRepository(db);
    this.submissionsRepo = new SubmissionsRepository(db);
  }

  async executeTargetSubmission(targetId: string): Promise<SubmissionResult> {
    const target = await this.campaignsRepo.findTargetById(targetId);
    if (!target) {
      throw new Error(`Target ${targetId} not found`);
    }

    // Acquire execution lock
    if (executionLocks.has(targetId)) {
      throw new Error(`Execution lock active for target ${targetId}. Cannot run concurrently.`);
    }
    executionLocks.add(targetId);

    try {
      // Step 1: Idempotency & previous attempts check
      if (target.status === 'submitted' || target.status === 'approved') {
        return {
          success: true,
          confirmationUrl: target.submission_url,
          externalSubmissionId: target.external_submission_id,
        };
      }

      await this.campaignsRepo.updateTargetStatus(targetId, 'submitting', { incrementAttempts: true });

      const campaign = await this.campaignsRepo.findById(target.campaign_id);
      const destination = await this.destinationsRepo.findById(target.destination_id);
      const product = await this.productsRepo.findById(campaign?.product_id || '');
      const content = await this.campaignsRepo.getContentVariant(targetId);

      if (!destination || !product || !content) {
        const errorMsg = 'Missing destination, product or generated content';
        await this.campaignsRepo.updateTargetStatus(targetId, 'failed', { errorMessage: errorMsg });
        return { success: false, errorMessage: errorMsg };
      }

      // Recheck policy
      if (destination.automation_policy === 'prohibited') {
        const reason = 'Destination marked prohibited for automated submission';
        await this.campaignsRepo.updateTargetStatus(targetId, 'skipped', { errorMessage: reason });
        return { success: false, errorMessage: reason };
      }

      // Step 2: Select adapter
      const adapter = globalAdapterRegistry.findForDestination(destination);

      // Step 3: Build UTM link
      const utmUrl = buildUTMUrl({
        baseUrl: product.website_url,
        source: destination.slug,
        campaign: campaign?.name || 'launch',
      });

      // Step 4: Execute adapter submission
      const result = await adapter.submit(
        {
          targetId,
          campaignId: target.campaign_id,
          product,
          destination,
          content,
          utmUrl,
          idempotencyKey: target.idempotency_key,
        },
        {
          env: this.env,
          screenshotService: {
            captureScreenshot: async (url: string) => `screenshots/${destination.slug}_${Date.now()}.png`,
          },
        }
      );

      // Step 5: Record attempt history
      await this.submissionsRepo.recordAttempt({
        target_id: targetId,
        attempt_number: target.attempts + 1,
        method: adapter.key,
        status: result.success ? 'success' : result.requiresIntervention ? 'requires_intervention' : 'failed',
        response_json: JSON.stringify(result.responsePayload || {}),
        screenshot_key: result.screenshotKey,
        confirmation_url: result.confirmationUrl,
        error_message: result.errorMessage,
        completed_at: new Date().toISOString(),
      });

      // Step 6: Handle result status
      if (result.success) {
        await this.campaignsRepo.updateTargetStatus(targetId, 'submitted', {
          adapterKey: adapter.key,
          externalSubmissionId: result.externalSubmissionId,
          submittedAt: new Date().toISOString(),
          errorCode: undefined,
          errorMessage: undefined,
        });

        // Schedule followup for Day 3 verification
        const followupDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
        await this.submissionsRepo.scheduleFollowup(targetId, 'status_check', followupDate);

        // Record analytics event
        await this.submissionsRepo.recordAnalyticsEvent(
          product.id,
          'submission_success',
          destination.slug,
          target.campaign_id,
          targetId,
          { url: result.confirmationUrl }
        );

        await logAudit(this.db, {
          action: 'submission_completed',
          resourceType: 'campaign_target',
          resourceId: targetId,
          details: { destination: destination.name, confirmation: result.confirmationUrl },
        });
      } else if (result.requiresIntervention) {
        await this.campaignsRepo.updateTargetStatus(targetId, 'manual_action_required', {
          adapterKey: adapter.key,
          errorMessage: result.interventionReason || 'Human intervention required',
        });

        await logAudit(this.db, {
          action: 'intervention_requested',
          resourceType: 'campaign_target',
          resourceId: targetId,
          details: { destination: destination.name, reason: result.interventionReason },
        });
      } else {
        await this.campaignsRepo.updateTargetStatus(targetId, 'failed', {
          errorMessage: result.errorMessage || 'Submission adapter returned failure',
        });
      }

      return result;
    } finally {
      executionLocks.delete(targetId);
    }
  }
}

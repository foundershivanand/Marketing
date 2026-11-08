import { DatabaseClient } from '../../lib/database/db';
import { DestinationsRepository } from '../../lib/database/destinations.repo';
import { SubmissionsRepository } from '../../lib/database/submissions.repo';
import { CampaignsRepository } from '../../lib/database/campaigns.repo';
import { MonitoringAgent } from '../../agents/monitoring.agent';
import { AIProvider } from '../../lib/ai/provider';
import { validateSafeUrl } from '../../lib/security/url-guard';

export class MonitoringWorkflow {
  private destinationsRepo: DestinationsRepository;
  private submissionsRepo: SubmissionsRepository;
  private campaignsRepo: CampaignsRepository;
  private monitoringAgent: MonitoringAgent;

  constructor(private db: DatabaseClient, aiProvider: AIProvider) {
    this.destinationsRepo = new DestinationsRepository(db);
    this.submissionsRepo = new SubmissionsRepository(db);
    this.campaignsRepo = new CampaignsRepository(db);
    this.monitoringAgent = new MonitoringAgent(aiProvider);
  }

  async runWeeklyAudit(): Promise<{ audited: number; issuesFound: number }> {
    const verifiedDestinations = await this.destinationsRepo.list({ status: 'verified' });
    let issuesFound = 0;

    for (const dest of verifiedDestinations) {
      const url = dest.submission_url || dest.source_url;
      if (!url) continue;

      const { valid } = validateSafeUrl(url);
      if (!valid) {
        await this.destinationsRepo.updateStatus(dest.id, 'restricted', 0.1);
        issuesFound++;
        continue;
      }

      try {
        const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
        if (res.status >= 400) {
          await this.destinationsRepo.updateStatus(dest.id, 'inactive', 0.2);
          issuesFound++;
        }
      } catch {
        // Network timeout / DNS issue
        await this.destinationsRepo.updateStatus(dest.id, 'paused', 0.4);
        issuesFound++;
      }
    }

    return { audited: verifiedDestinations.length, issuesFound };
  }

  async processPendingFollowups(): Promise<{ processed: number }> {
    const pending = await this.submissionsRepo.listPendingFollowups();

    for (const f of pending) {
      const target = await this.campaignsRepo.findTargetById(f.target_id);
      if (!target) continue;

      const destination = await this.destinationsRepo.findById(target.destination_id);
      if (!destination) continue;

      const res = await this.monitoringAgent.checkStatus({
        targetId: f.target_id,
        destination,
        externalSubmissionId: target.external_submission_id,
        confirmationUrl: target.submission_url,
      });

      if (res.status === 'live' || res.status === 'approved') {
        await this.campaignsRepo.updateTargetStatus(f.target_id, 'approved');
      }
    }

    return { processed: pending.length };
  }
}

import { describe, it, expect } from 'vitest';
import { createMemoryDatabase } from '../../src/lib/database/db';
import { DestinationsRepository } from '../../src/lib/database/destinations.repo';
import { MonitoringWorkflow } from '../../src/worker/workflows/monitoring.workflow';
import { MockAIProvider } from '../../src/lib/ai/mock';

describe('Monitoring Workflow & Audit', () => {
  it('runs audit on active destinations', async () => {
    const db = createMemoryDatabase();
    const destinationsRepo = new DestinationsRepository(db);
    const mockAi = new MockAIProvider();
    const workflow = new MonitoringWorkflow(db, mockAi);

    await destinationsRepo.upsert({
      name: 'Safe Public Website',
      slug: 'safe-website',
      source_url: 'https://example.com',
      submission_url: 'https://example.com/submit',
      category: 'startup_directory',
      submission_method: 'form',
      automation_policy: 'allowed',
      pricing_type: 'free',
      confidence: 1.0,
      status: 'verified',
    });

    const summary = await workflow.runWeeklyAudit();
    expect(summary.audited).toBeGreaterThanOrEqual(1);
  });
});

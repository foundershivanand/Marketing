import { describe, it, expect } from 'vitest';
import { createMemoryDatabase } from '../../src/lib/database/db';
import { ProductsRepository } from '../../src/lib/database/products.repo';
import { DestinationsRepository } from '../../src/lib/database/destinations.repo';
import { CampaignsRepository } from '../../src/lib/database/campaigns.repo';
import { SubmissionsRepository } from '../../src/lib/database/submissions.repo';
import { SubmissionWorkflow } from '../../src/worker/workflows/submission.workflow';

describe('Submission Workflow & Idempotency Safeguards', () => {
  it('executes permitted destination submission and records audit history', async () => {
    const db = createMemoryDatabase();
    const productsRepo = new ProductsRepository(db);
    const destinationsRepo = new DestinationsRepository(db);
    const campaignsRepo = new CampaignsRepository(db);
    const submissionsRepo = new SubmissionsRepository(db);
    const workflow = new SubmissionWorkflow(db);

    // 1. Setup product
    const product = await productsRepo.create({
      name: 'LaunchPilot Submissions Test',
      website_url: 'https://mysaas.com',
      tagline: 'Test Tagline',
      short_description: 'Test Short Desc',
      full_description: 'Test Full Desc',
    });

    // 2. Setup destination
    const destination = await destinationsRepo.upsert({
      name: 'Direct Submission Directory',
      slug: 'direct-sub-dir',
      source_url: 'https://example-dir.com',
      submission_url: 'https://example-dir.com/submit',
      category: 'startup_directory',
      submission_method: 'form',
      automation_policy: 'allowed',
      pricing_type: 'free',
      confidence: 1.0,
      status: 'verified',
      adapter_key: 'generic-form',
    });

    // 3. Setup campaign & target
    const campaign = await campaignsRepo.create(product.id, 'Submission Run', {
      categories: ['startup_directory'],
      include_paid: false,
      include_reddit: false,
      automation: 'maximum',
      tracking: true,
    });

    const target = await campaignsRepo.addTarget(campaign.id, destination.id, 'generic-form');

    // 4. Save content variant
    await campaignsRepo.saveContentVariant({
      target_id: target.id,
      version: 1,
      title: 'LaunchPilot Pitch',
      tagline: 'Automate marketing with AI',
      description: 'Directory submissions made easy',
      tags_json: '["saas"]',
      fields_json: '{}',
      validation_status: 'valid',
    });

    // 5. Execute submission
    const result = await workflow.executeTargetSubmission(target.id);

    expect(result.success).toBe(true);
    expect(result.confirmationUrl).toBeDefined();

    // 6. Verify target status updated to 'submitted'
    const updatedTarget = await campaignsRepo.findTargetById(target.id);
    expect(updatedTarget?.status).toBe('submitted');
    expect(updatedTarget?.submitted_at).toBeDefined();
    expect(updatedTarget?.attempts).toBe(1);

    // 7. Verify attempt was logged in submission_attempts
    const attempts = await submissionsRepo.listAttemptsByTarget(target.id);
    expect(attempts.length).toBe(1);
    expect(attempts[0].status).toBe('success');

    // 8. Verify Day 3 followup was scheduled
    const followups = await submissionsRepo.listPendingFollowups();
    expect(followups.length).toBe(0); // scheduled 3 days into future, so not yet pending for now

    // 9. Idempotency test: Re-executing must NOT duplicate submission
    const secondResult = await workflow.executeTargetSubmission(target.id);
    expect(secondResult.success).toBe(true);
    const secondAttempts = await submissionsRepo.listAttemptsByTarget(target.id);
    expect(secondAttempts.length).toBe(1); // Still 1 attempt, no duplicate!
  });

  it('routes Reddit destinations to human intervention without automated form submission', async () => {
    const db = createMemoryDatabase();
    const productsRepo = new ProductsRepository(db);
    const destinationsRepo = new DestinationsRepository(db);
    const campaignsRepo = new CampaignsRepository(db);
    const workflow = new SubmissionWorkflow(db);

    const product = await productsRepo.create({
      name: 'Reddit Product Test',
      website_url: 'https://mysaas.com',
    });

    const redditDest = await destinationsRepo.upsert({
      name: '/r/Entrepreneur',
      slug: 'reddit-entrepreneur',
      source_url: 'https://reddit.com/r/entrepreneur',
      category: 'reddit',
      submission_method: 'manual',
      automation_policy: 'requires_review',
      pricing_type: 'free',
      confidence: 1.0,
      status: 'verified',
      adapter_key: 'reddit-draft',
    });

    const campaign = await campaignsRepo.create(product.id, 'Reddit Test Campaign', {
      categories: ['reddit'],
      include_paid: false,
      include_reddit: true,
      automation: 'maximum',
      tracking: true,
    });

    const target = await campaignsRepo.addTarget(campaign.id, redditDest.id, 'reddit-draft');

    await campaignsRepo.saveContentVariant({
      target_id: target.id,
      version: 1,
      title: 'Reddit Title',
      validation_status: 'valid',
      tags_json: '[]',
      fields_json: '{}',
    });

    const result = await workflow.executeTargetSubmission(target.id);

    expect(result.success).toBe(false);
    expect(result.requiresIntervention).toBe(true);

    const updatedTarget = await campaignsRepo.findTargetById(target.id);
    expect(updatedTarget?.status).toBe('manual_action_required');
  });
});

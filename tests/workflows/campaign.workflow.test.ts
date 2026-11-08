import { describe, it, expect } from 'vitest';
import { createMemoryDatabase } from '../../src/lib/database/db';
import { ProductsRepository } from '../../src/lib/database/products.repo';
import { DestinationsRepository } from '../../src/lib/database/destinations.repo';
import { CampaignsRepository } from '../../src/lib/database/campaigns.repo';
import { CampaignWorkflow } from '../../src/worker/workflows/campaign.workflow';
import { MockAIProvider } from '../../src/lib/ai/mock';

describe('Campaign Workflow Orchestration', () => {
  it('orchestrates research, content generation, and policy checks', async () => {
    const db = createMemoryDatabase();
    const productsRepo = new ProductsRepository(db);
    const destinationsRepo = new DestinationsRepository(db);
    const campaignsRepo = new CampaignsRepository(db);
    const aiProvider = new MockAIProvider();

    // 1. Create a product
    const product = await productsRepo.create({
      name: 'LaunchPilot Test Product',
      website_url: 'https://testproduct.com',
      tagline: 'Test Tagline',
      short_description: 'Test short description',
      full_description: 'Test full description with details',
      facts: ['Open source', 'Built on Cloudflare'],
      prohibited_claims: ['Never claim 100k users'],
    });

    // 2. Create sample destinations
    await destinationsRepo.upsert({
      name: 'Sample Startup Directory',
      slug: 'sample-startup-dir',
      category: 'startup_directory',
      submission_method: 'form',
      automation_policy: 'allowed',
      pricing_type: 'free',
      confidence: 1.0,
      status: 'verified',
    });

    await destinationsRepo.upsert({
      name: '/r/SideProject',
      slug: 'reddit-sideproject',
      category: 'reddit',
      submission_method: 'manual',
      automation_policy: 'requires_review',
      pricing_type: 'free',
      confidence: 0.9,
      status: 'verified',
    });

    // 3. Create campaign
    const campaign = await campaignsRepo.create(product.id, 'Workflow Test Campaign', {
      categories: ['startup_directory', 'reddit'],
      include_paid: false,
      include_reddit: true,
      automation: 'maximum',
      tracking: true,
    });

    // 4. Run Campaign Workflow
    const workflow = new CampaignWorkflow(db, aiProvider);
    const summary = await workflow.runCampaign(campaign.id);

    expect(summary.destinationsFound).toBeGreaterThanOrEqual(2);
    expect(summary.eligible).toBeGreaterThanOrEqual(1);

    // Verify campaign targets were generated
    const targets = await campaignsRepo.listTargets(campaign.id);
    expect(targets.length).toBeGreaterThanOrEqual(2);

    // Verify content variant was generated
    const firstTarget = targets[0];
    const content = await campaignsRepo.getContentVariant(firstTarget.id);
    expect(content).toBeDefined();
    expect(content?.title).toBeDefined();
  });
});

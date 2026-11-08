import { describe, it, expect } from 'vitest';
import { ContentAgent } from '../../src/agents/content.agent';
import { MockAIProvider } from '../../src/lib/ai/mock';
import { createMemoryDatabase } from '../../src/lib/database/db';
import { ProductsRepository } from '../../src/lib/database/products.repo';
import { DestinationsRepository } from '../../src/lib/database/destinations.repo';
import { CampaignsRepository } from '../../src/lib/database/campaigns.repo';
import { Product } from '../../src/types/product';
import { Destination } from '../../src/types/destination';

describe('Content Generation Agent', () => {
  it('generates tailored content packages adhering to product facts and constraints', async () => {
    const db = createMemoryDatabase();
    const productsRepo = new ProductsRepository(db);
    const destinationsRepo = new DestinationsRepository(db);
    const campaignsRepo = new CampaignsRepository(db);
    const mockAi = new MockAIProvider();
    const contentAgent = new ContentAgent(mockAi, campaignsRepo);

    // 1. Setup product in DB
    const sampleProduct = await productsRepo.create({
      name: 'LaunchPilot AI',
      website_url: 'https://launchpilot.example.com',
      tagline: 'Autonomous Startup Distribution Engine',
      short_description: 'Automate directory submissions with AI agents.',
      full_description: 'LaunchPilot deploys six specialized agents to distribute your startup announcements across 100+ destinations.',
      target_audience: 'Founders & Indie Hackers',
      category: 'Developer Tools',
      pricing_model: 'Freemium',
      founder_name: 'Alex Rivera',
      facts: [
        'Open source core on GitHub',
        'Built on Cloudflare Workers and D1',
      ],
      prohibited_claims: [
        'Never claim SOC2 certification',
        'Never claim over 10,000 paying enterprise customers',
      ],
    });

    // 2. Setup destination in DB
    const sampleDestination = await destinationsRepo.upsert({
      name: 'SaaSHub',
      slug: 'saashub',
      category: 'startup_directory',
      submission_method: 'form',
      automation_policy: 'allowed',
      pricing_type: 'free',
      requirements_json: JSON.stringify({
        required_fields: ['title', 'tagline', 'description'],
        character_limits: { tagline: 60, short_desc: 160, long_desc: 1000 },
      }),
      form_schema_json: '{}',
      confidence: 1.0,
      status: 'verified',
    });

    // 3. Setup campaign and target in DB
    const campaign = await campaignsRepo.create(sampleProduct.id, 'Content Test Campaign', {
      categories: ['startup_directory'],
      include_paid: false,
      include_reddit: false,
      automation: 'maximum',
      tracking: true,
    });

    const target = await campaignsRepo.addTarget(campaign.id, sampleDestination.id);

    const output = await contentAgent.generateForTarget(target.id, sampleProduct, sampleDestination);

    expect(output.title).toBeDefined();
    expect(output.tagline).toBeDefined();
    expect(output.short_description).toBeDefined();
    expect(output.long_description).toBeDefined();
    expect(output.key_features.length).toBeGreaterThan(0);
    expect(output.relevant_tags.length).toBeGreaterThan(0);

    // Verify persisted content variant in DB
    const variant = await campaignsRepo.getContentVariant(target.id);
    expect(variant).toBeDefined();
    expect(variant?.target_id).toBe(target.id);
    expect(variant?.title).toBe(output.title);
    expect(variant?.validation_status).toBe('valid');
  });
});

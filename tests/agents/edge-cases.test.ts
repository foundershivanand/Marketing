import { describe, it, expect, beforeEach } from 'vitest';
import { createMemoryDatabase, DatabaseClient } from '../../src/lib/database/db';
import { ContentAgent } from '../../src/agents/content.agent';
import { PlannerAgent } from '../../src/agents/planner.agent';
import { ProductsRepository } from '../../src/lib/database/products.repo';
import { DestinationsRepository } from '../../src/lib/database/destinations.repo';
import { CampaignsRepository } from '../../src/lib/database/campaigns.repo';
import { AIProvider } from '../../src/lib/ai/provider';
import { app } from '../../src/worker/index';

describe('Agent Edge Cases & Guardrail Enforcement', () => {
  let db: DatabaseClient;
  let productsRepo: ProductsRepository;
  let destinationsRepo: DestinationsRepository;
  let campaignsRepo: CampaignsRepository;

  beforeEach(() => {
    db = createMemoryDatabase();
    productsRepo = new ProductsRepository(db);
    destinationsRepo = new DestinationsRepository(db);
    campaignsRepo = new CampaignsRepository(db);
  });

  it('ContentAgent auto-trims long taglines at word boundaries and sanitizes prohibited claims', async () => {
    // Mock AI that generates content with a prohibited claim and overly long tagline
    const mockAI: AIProvider = {
      generateJSON: async <T>() => ({
        title: 'LaunchPilot Super',
        tagline: 'This is an extremely long tagline that exceeds the 40 characters limit without question',
        short_description: 'Valid short pitch.',
        long_description: 'We boast $500k MRR and SOC2 certified enterprise security.',
        founder_intro: 'Hi, I am the founder.',
        problem_statement: 'Distributing a startup manually is slow.',
        solution_statement: 'Autonomous distribution across directories.',
        key_features: ['Automated mapping', 'UTM tracking'],
        target_audience: 'SaaS founders and indie hackers',
        pricing_explanation: 'Free tier with pro upgrades',
        seo_keywords: ['ai', 'startup'],
        relevant_tags: ['saas', 'ai'],
        submission_fields: {},
        warnings: [],
        missing_info: [],
      } as unknown as T),
      generateText: async () => 'sample text',
    };

    const agent = new ContentAgent(mockAI, campaignsRepo);

    const product = await productsRepo.create({
      name: 'LaunchPilot Super',
      website_url: 'https://launchpilot.dev',
      negative_constraints: ['$500k MRR', 'SOC2 certified'],
    });

    const destination = await destinationsRepo.upsert({
      name: 'Tight Directory',
      slug: 'tight-dir',
      category: 'startup_directory',
      requirements_json: JSON.stringify({
        character_limits: { tagline: 35, short_desc: 100, long_desc: 500 },
      }),
    });

    const campaign = await campaignsRepo.create(product.id, 'Edge Case Sprint');
    const target = await campaignsRepo.addTarget(campaign.id, destination.id);

    const output = await agent.generateForTarget(target.id, product, destination);

    // Tagline should be trimmed to <= 35 chars
    expect(output.tagline.length).toBeLessThanOrEqual(35);
    // Negative constraints should be scrubbed out
    expect(output.long_description).not.toContain('$500k MRR');
    expect(output.long_description).not.toContain('SOC2 certified');
    expect(output.warnings.some((w: string) => w.includes('prohibited claim'))).toBe(true);
  });

  it('PlannerAgent strictly enforces payment intervention for paid directories', async () => {
    const mockAI: AIProvider = {
      generateJSON: async <T>() => ({} as unknown as T),
      generateText: async () => '',
    };

    const planner = new PlannerAgent(mockAI);

    const product = await productsRepo.create({
      name: 'Budget App',
      website_url: 'https://budget.app',
    });

    const paidDest = await destinationsRepo.upsert({
      name: 'Forbes Paid Directory',
      slug: 'forbes-paid',
      category: 'product_directory',
      pricing_type: 'paid',
      pricing_amount: 299,
      status: 'verified',
    });

    const plan = await planner.planExecution(paidDest, product, 'camp_test', false);

    expect(plan.eligibility).toBe('review_required');
    expect(plan.required_intervention).toBe('payment');
    expect(plan.reason).toContain('Requires explicit approval');
  });

  it('Worker health check returns database latency and diagnostic metrics', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.status).toBe('ok');
    expect(data.database.status).toBe('ok');
    expect(typeof data.database.latency_ms).toBe('number');
    expect(data.system.ai_provider).toBeDefined();
  });
});

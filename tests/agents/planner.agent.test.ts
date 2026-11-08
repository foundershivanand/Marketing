import { describe, it, expect } from 'vitest';
import { PlannerAgent } from '../../src/agents/planner.agent';
import { MockAIProvider } from '../../src/lib/ai/mock';
import { Destination } from '../../src/types/destination';
import { Product } from '../../src/types/product';

describe('Planner Agent Safeguards', () => {
  const planner = new PlannerAgent(new MockAIProvider());

  const sampleProduct: Product = {
    id: 'prod_test',
    name: 'LaunchPilot',
    slug: 'launchpilot',
    website_url: 'https://launchpilot.example.com',
    social_links_json: '{}',
    facts_json: '[]',
    prohibited_claims_json: '[]',
  };

  it('skips already submitted destinations (idempotency guard)', async () => {
    const dest: Destination = {
      id: 'dest_1',
      name: 'Product Hunt',
      slug: 'product-hunt',
      category: 'launch_platform',
      submission_method: 'form',
      automation_policy: 'allowed',
      pricing_type: 'free',
      requirements_json: '{}',
      form_schema_json: '{}',
      confidence: 1.0,
      status: 'verified',
      evidence_json: '[]',
    };

    const plan = await planner.planExecution(dest, sampleProduct, 'camp_1', true);
    expect(plan.eligibility).toBe('skipped');
    expect(plan.reason).toContain('already been submitted');
  });

  it('marks prohibited destinations as prohibited', async () => {
    const prohibitedDest: Destination = {
      id: 'dest_2',
      name: 'Strict Editorial',
      slug: 'strict-editorial',
      category: 'editorial',
      submission_method: 'form',
      automation_policy: 'prohibited',
      pricing_type: 'free',
      requirements_json: '{}',
      form_schema_json: '{}',
      confidence: 1.0,
      status: 'restricted',
      evidence_json: '[]',
    };

    const plan = await planner.planExecution(prohibitedDest, sampleProduct, 'camp_1', false);
    expect(plan.eligibility).toBe('prohibited');
  });

  it('requires payment intervention for paid directories', async () => {
    const paidDest: Destination = {
      id: 'dest_3',
      name: 'Featured Startups',
      slug: 'featured-startups',
      category: 'startup_directory',
      submission_method: 'form',
      automation_policy: 'allowed',
      pricing_type: 'paid',
      pricing_amount: 49,
      requirements_json: '{}',
      form_schema_json: '{}',
      confidence: 1.0,
      status: 'verified',
      evidence_json: '[]',
    };

    const plan = await planner.planExecution(paidDest, sampleProduct, 'camp_1', false);
    expect(plan.eligibility).toBe('review_required');
    expect(plan.required_intervention).toBe('payment');
  });
});

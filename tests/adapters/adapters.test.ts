import { describe, it, expect } from 'vitest';
import { globalAdapterRegistry } from '../../src/adapters/registry';
import { Destination } from '../../src/types/destination';
import { Product } from '../../src/types/product';
import { ContentVariant } from '../../src/types/campaign';

describe('Adapter Registry & Safeguards', () => {
  it('registers all required adapters', () => {
    const adapters = globalAdapterRegistry.list();
    const keys = adapters.map(a => a.key);

    expect(keys).toContain('generic-form');
    expect(keys).toContain('directory');
    expect(keys).toContain('email-pitch');
    expect(keys).toContain('official-api');
    expect(keys).toContain('reddit-draft');
    expect(keys).toContain('manual');
  });

  it('routes Reddit communities to RedditDraftAdapter requiring review', async () => {
    const redditDest: Destination = {
      id: 'dest_reddit',
      name: '/r/SideProject',
      slug: 'reddit-sideproject',
      source_url: 'https://reddit.com/r/sideproject',
      category: 'reddit',
      submission_method: 'manual',
      automation_policy: 'requires_review',
      pricing_type: 'free',
      requirements_json: '{}',
      form_schema_json: '{}',
      confidence: 0.9,
      status: 'verified',
      evidence_json: '[]',
    };

    const adapter = globalAdapterRegistry.findForDestination(redditDest);
    expect(adapter.key).toBe('reddit-draft');

    const dummyProduct: Product = {
      id: 'p1',
      name: 'LaunchPilot',
      slug: 'launchpilot',
      website_url: 'https://launchpilot.example.com',
      tagline: 'AI Startup Distribution',
      social_links_json: '{}',
      facts_json: '[]',
      prohibited_claims_json: '[]',
    };

    const dummyContent: ContentVariant = {
      id: 'c1',
      target_id: 't1',
      version: 1,
      validation_status: 'valid',
      tags_json: '[]',
      fields_json: '{}',
    };

    const result = await adapter.submit(
      {
        targetId: 't1',
        campaignId: 'camp1',
        product: dummyProduct,
        destination: redditDest,
        content: dummyContent,
        utmUrl: 'https://launchpilot.example.com?utm_source=reddit',
        idempotencyKey: 'idemp_1',
      },
      {}
    );

    // Safeguard: Reddit must never submit automatically
    expect(result.success).toBe(false);
    expect(result.requiresIntervention).toBe(true);
    expect(result.interventionType).toBe('approval');
    expect(result.responsePayload?.subreddit).toBe('r/SideProject');
  });
});

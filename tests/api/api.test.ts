import { describe, it, expect } from 'vitest';
import { app } from '../../src/worker/index';

describe('LaunchPilot Worker REST API Suite', () => {
  let createdProductId: string;
  let createdCampaignId: string;
  let sampleDestinationId: string;
  let sampleTargetId: string;

  it('GET /api/health returns 200 OK', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.status).toBe('ok');
    expect(data.app).toBe('LaunchPilot');
  });

  it('POST /api/products creates a product profile with negative constraints', async () => {
    const res = await app.request('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'SuperAgent API',
        website_url: 'https://superagent.example.com',
        tagline: 'Autonomous AI Agent Platform',
        short_description: 'Build and deploy autonomous agents in minutes.',
        category: 'AI / Developer Tools',
        prohibited_claims: ['Never claim SOC2 certification', 'Never claim $1M ARR'],
        facts: ['Open source', 'Built on Cloudflare'],
      }),
    });

    expect(res.status).toBe(201);
    const data: any = await res.json();
    expect(data.id).toBeDefined();
    expect(data.name).toBe('SuperAgent API');
    expect(JSON.parse(data.prohibited_claims_json)).toContain('Never claim SOC2 certification');
    createdProductId = data.id;
  });

  it('GET /api/products returns list including created product', async () => {
    const res = await app.request('/api/products');
    expect(res.status).toBe(200);
    const products: any = await res.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.some((p: any) => p.id === createdProductId)).toBe(true);
  });

  it('GET /api/products/:id returns detailed product and assets', async () => {
    const res = await app.request(`/api/products/${createdProductId}`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.id).toBe(createdProductId);
    expect(Array.isArray(data.assets)).toBe(true);
  });

  it('PATCH /api/products/:id updates product details', async () => {
    const res = await app.request(`/api/products/${createdProductId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tagline: 'Updated Tagline for Test',
      }),
    });

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.tagline).toBe('Updated Tagline for Test');
  });

  it('POST /api/import/github imports destinations from README markdown', async () => {
    const res = await app.request('/api/import/github', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        markdown: `
# Reddit
* /r/SideProject - https://reddit.com/r/sideproject
* /r/SaaS - https://reddit.com/r/SaaS

# Websites
* Product Hunt - https://www.producthunt.com/
* SaaSHub - https://www.saashub.com/
        `,
      }),
    });

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(data.result.imported).toBeGreaterThanOrEqual(4);
  });

  it('GET /api/destinations returns destinations list', async () => {
    const res = await app.request('/api/destinations?search=Product+Hunt');
    expect(res.status).toBe(200);
    const destinations: any = await res.json();
    expect(destinations.length).toBeGreaterThan(0);
    sampleDestinationId = destinations[0].id;
  });

  it('GET /api/destinations/stats returns counts', async () => {
    const res = await app.request('/api/destinations/stats');
    expect(res.status).toBe(200);
    const stats: any = await res.json();
    expect(stats.total).toBeGreaterThan(0);
  });

  it('POST /api/destinations/:id/verify triggers research agent', async () => {
    const res = await app.request(`/api/destinations/${sampleDestinationId}/verify`, {
      method: 'POST',
    });
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(data.result.active).toBeDefined();
  });

  it('POST /api/campaigns creates a new distribution campaign', async () => {
    const res = await app.request('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: createdProductId,
        name: 'API Test Campaign',
        settings: {
          categories: ['startup_directory', 'launch_platform'],
          include_paid: false,
          include_reddit: false,
          automation: 'maximum',
          tracking: true,
        },
      }),
    });

    expect(res.status).toBe(201);
    const data: any = await res.json();
    expect(data.id).toBeDefined();
    createdCampaignId = data.id;
  });

  it('POST /api/campaigns/:id/start triggers campaign workflow', async () => {
    const res = await app.request(`/api/campaigns/${createdCampaignId}/start`, {
      method: 'POST',
    });
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.campaign_id).toBe(createdCampaignId);
    expect(data.status).toBe('generating');
  });

  it('GET /api/campaigns/:id/results returns targets and stats', async () => {
    const res = await app.request(`/api/campaigns/${createdCampaignId}/results`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.campaign_id).toBe(createdCampaignId);
    expect(data.stats).toBeDefined();
    expect(Array.isArray(data.targets)).toBe(true);

    if (data.targets.length > 0) {
      sampleTargetId = data.targets[0].id;
    }
  });

  it('GET /api/submissions lists active submissions', async () => {
    const res = await app.request('/api/submissions');
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('POST /api/submissions/targets/:id/intervention records human intervention', async () => {
    if (!sampleTargetId) return;

    const res = await app.request(`/api/submissions/targets/${sampleTargetId}/intervention`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'manually_submitted',
        confirmation_url: 'https://example.com/listing/approved-123',
        notes: 'Manually verified and published',
      }),
    });

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
  });

  it('POST /api/analytics/track and GET /api/analytics/:productId records and retrieves growth analytics', async () => {
    // Record click
    await app.request('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: createdProductId,
        eventType: 'visit',
        source: 'producthunt',
      }),
    });

    // Get analytics
    const res = await app.request(`/api/analytics/${createdProductId}`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.product_id).toBe(createdProductId);
    expect(data.total_events).toBeGreaterThan(0);
    expect(data.analysis?.ranked_destinations).toBeDefined();
  });
});

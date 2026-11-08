import { describe, it, expect } from 'vitest';
import { AnalyticsAgent } from '../../src/agents/analytics.agent';
import { MockAIProvider } from '../../src/lib/ai/mock';

describe('Growth Analytics Agent', () => {
  const agent = new AnalyticsAgent(new MockAIProvider());

  it('ranks destinations and produces actionable recommendations', async () => {
    const res = await agent.analyzeProductPerformance({
      productId: 'prod_123',
      events: [
        { eventType: 'visit', source: 'product-hunt', metadata: {}, createdAt: new Date().toISOString() },
        { eventType: 'visit', source: 'product-hunt', metadata: {}, createdAt: new Date().toISOString() },
        { eventType: 'signup', source: 'product-hunt', metadata: {}, createdAt: new Date().toISOString() },
        { eventType: 'visit', source: 'saashub', metadata: {}, createdAt: new Date().toISOString() },
      ],
    });

    expect(res.ranked_destinations.length).toBeGreaterThan(0);
    expect(res.summary).toBeDefined();
    expect(res.key_insights.length).toBeGreaterThan(0);

    const first = res.ranked_destinations[0];
    expect(first.name).toBeDefined();
    expect(['scale', 'maintain', 'drop']).toContain(first.recommendation);
  });
});

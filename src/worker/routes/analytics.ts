import { Hono } from 'hono';
import { getDatabase } from '../../lib/database/db';
import { SubmissionsRepository } from '../../lib/database/submissions.repo';
import { AnalyticsAgent } from '../../agents/analytics.agent';
import { getAIProvider } from '../../lib/ai/factory';

export const analyticsRouter = new Hono();

analyticsRouter.get('/:productId', async (c) => {
  const db = getDatabase(c.env);
  const repo = new SubmissionsRepository(db);
  const ai = getAIProvider(c.env);
  const agent = new AnalyticsAgent(ai);
  const productId = c.req.param('productId');

  const events = await repo.getAnalytics(productId);
  const analysis = await agent.analyzeProductPerformance({
    productId,
    events: events.map((e: any) => ({
      eventType: e.event_type,
      source: e.source,
      metadata: JSON.parse(e.metadata_json || '{}'),
      createdAt: e.created_at,
    })),
  });

  return c.json({
    product_id: productId,
    total_events: events.length,
    analysis,
    raw_events: events.slice(0, 50),
  });
});

analyticsRouter.post('/track', async (c) => {
  const db = getDatabase(c.env);
  const repo = new SubmissionsRepository(db);
  const body = await c.req.json();

  const { productId, eventType = 'visit', source = 'direct', campaignId, targetId, metadata } = body;

  if (!productId) {
    return c.json({ error: 'productId is required' }, 400);
  }

  await repo.recordAnalyticsEvent(productId, eventType, source, campaignId, targetId, metadata);
  return c.json({ success: true, recorded: true });
});

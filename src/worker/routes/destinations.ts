import { Hono } from 'hono';
import { getDatabase } from '../../lib/database/db';
import { DestinationsRepository } from '../../lib/database/destinations.repo';
import { ResearchAgent } from '../../agents/research.agent';
import { getAIProvider } from '../../lib/ai/factory';
import { logAudit } from '../../lib/audit/logger';

export const destinationsRouter = new Hono();

destinationsRouter.get('/', async (c) => {
  const db = getDatabase(c.env);
  const repo = new DestinationsRepository(db);

  const category = c.req.query('category');
  const status = c.req.query('status') as any;
  const automation_policy = c.req.query('automation_policy') as any;
  const pricing_type = c.req.query('pricing_type') as any;
  const search = c.req.query('search');

  const destinations = await repo.list({
    category,
    status,
    automation_policy,
    pricing_type,
    search,
  });

  return c.json(destinations);
});

destinationsRouter.get('/stats', async (c) => {
  const db = getDatabase(c.env);
  const repo = new DestinationsRepository(db);
  const stats = await repo.countStats();
  return c.json(stats);
});

destinationsRouter.get('/:id', async (c) => {
  const db = getDatabase(c.env);
  const repo = new DestinationsRepository(db);
  const destination = await repo.findById(c.req.param('id'));

  if (!destination) {
    return c.json({ error: 'Destination not found' }, 404);
  }

  const checks = await repo.getChecks(destination.id);
  return c.json({ ...destination, checks });
});

destinationsRouter.post('/:id/verify', async (c) => {
  const db = getDatabase(c.env);
  const repo = new DestinationsRepository(db);
  const ai = getAIProvider(c.env);
  const agent = new ResearchAgent(ai, repo);
  const destinationId = c.req.param('id');

  try {
    const result = await agent.researchDestination(destinationId);
    await logAudit(db, {
      action: 'destination_researched',
      resourceType: 'destination',
      resourceId: destinationId,
      details: { confidence: result.confidence, active: result.active },
    });

    return c.json({ success: true, result });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

destinationsRouter.patch('/:id', async (c) => {
  const db = getDatabase(c.env);
  const repo = new DestinationsRepository(db);
  const id = c.req.param('id');
  const existing = await repo.findById(id);

  if (!existing) {
    return c.json({ error: 'Destination not found' }, 404);
  }

  const body = await c.req.json();
  const updated = await repo.upsert({
    ...existing,
    ...body,
    name: body.name || existing.name,
    slug: existing.slug,
    category: body.category || existing.category,
  });

  return c.json(updated);
});

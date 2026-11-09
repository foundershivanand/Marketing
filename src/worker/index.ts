import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/auth';
import { rateLimit } from './middleware/rate-limit';
import { productsRouter } from './routes/products';
import { destinationsRouter } from './routes/destinations';
import { campaignsRouter } from './routes/campaigns';
import { submissionsRouter } from './routes/submissions';
import { analyticsRouter } from './routes/analytics';
import { importsRouter } from './routes/imports';
import { QueueConsumer } from './queue/consumer';
import { getDatabase } from '../lib/database/db';
import { CampaignWorkflow as CampaignWorkflowService } from './workflows/campaign.workflow';
import { getAIProvider } from '../lib/ai/factory';

export const app = new Hono();

// Global Middlewares
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'CF-Access-Authenticated-User-Email'],
}));

app.use('/api/*', rateLimit(300, 60000));
app.use('/api/products/*', authMiddleware);
app.use('/api/campaigns/*', authMiddleware);
app.use('/api/destinations/:id/verify', authMiddleware);

// Health Check & Diagnostic Status
app.get('/api/health', async (c) => {
  const db = getDatabase(c.env);
  let dbStatus = 'ok';
  let dbLatencyMs = 0;

  try {
    const start = Date.now();
    await db.prepare('SELECT 1').first();
    dbLatencyMs = Date.now() - start;
  } catch (err: any) {
    dbStatus = `error: ${err.message}`;
  }

  const memoryUsage = typeof process !== 'undefined' && process.memoryUsage ? process.memoryUsage() : null;

  return c.json({
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    app: 'LaunchPilot',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      latency_ms: dbLatencyMs,
    },
    system: {
      uptime_seconds: typeof process !== 'undefined' && process.uptime ? Math.round(process.uptime()) : null,
      heap_used_mb: memoryUsage ? Math.round(memoryUsage.heapUsed / 1024 / 1024) : null,
      ai_provider: ((c.env as any)?.AI_PROVIDER || process.env.AI_PROVIDER || 'mock').toLowerCase(),
    },
  });
});

// Global Defensive Error Handler - Guarantees Server Never Crashes Uncaught
app.onError((err, c) => {
  console.error(`[LaunchPilot Worker Global Error] ${c.req.method} ${c.req.url}:`, err);
  return c.json(
    {
      error: err.message || 'An unexpected internal server error occurred',
      status: 'error',
      code: (err as any).code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      path: c.req.path,
    },
    500
  );
});

// API Routes
app.route('/api/products', productsRouter);
app.route('/api/destinations', destinationsRouter);
app.route('/api/campaigns', campaignsRouter);
app.route('/api/submissions', submissionsRouter);
app.route('/api/analytics', analyticsRouter);
app.route('/api/import', importsRouter);

// Fallback for static assets or 404
app.notFound(async (c) => {
  if (c.req.path.startsWith('/api')) {
    return c.json({ error: 'Endpoint not found', path: c.req.path }, 404);
  }
  if ((c.env as any)?.STATIC_ASSETS) {
    return await (c.env as any).STATIC_ASSETS.fetch(c.req.raw);
  }
  return c.text('LaunchPilot API Server', 200);
});

// Cloudflare Worker Export with Queue & Workflow bindings
export default {
  fetch(request: Request, env: any, ctx: any) {
    return app.fetch(request, env, ctx);
  },

  // Cloudflare Queue Consumer
  async queue(batch: MessageBatch<any>, env: any): Promise<void> {
    const db = getDatabase(env);
    const consumer = new QueueConsumer(db, env);
    await consumer.processBatch(
      batch.messages.map((m) => ({
        body: m.body,
        ack: () => m.ack(),
        retry: () => m.retry(),
      }))
    );
  },
};

import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from 'cloudflare:workers';

// Export Workflow class for Cloudflare Workflows binding
export class CampaignWorkflow extends WorkflowEntrypoint<any, any> {
  async run(event: WorkflowEvent<any>, step: WorkflowStep) {
    const env = this.env || (event as any).env;
    const db = getDatabase(env);
    const ai = getAIProvider(env);
    const workflow = new CampaignWorkflowService(db, ai, env);

    return await step.do('run-campaign', async () => {
      return await workflow.runCampaign(event.payload.campaignId);
    });
  }
}

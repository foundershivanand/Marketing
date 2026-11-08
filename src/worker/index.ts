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
import { CampaignWorkflow } from './workflows/campaign.workflow';
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

// Health Check
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    app: 'LaunchPilot',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.route('/api/products', productsRouter);
app.route('/api/destinations', destinationsRouter);
app.route('/api/campaigns', campaignsRouter);
app.route('/api/submissions', submissionsRouter);
app.route('/api/analytics', analyticsRouter);
app.route('/api/import', importsRouter);

// Fallback for static assets or 404
app.notFound((c) => {
  if (c.req.path.startsWith('/api')) {
    return c.json({ error: 'Endpoint not found', path: c.req.path }, 404);
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

// Export Workflow class for Cloudflare Workflows binding
export class CloudflareCampaignWorkflow {
  async run(event: any, step: any) {
    const db = getDatabase(event.env);
    const ai = getAIProvider(event.env);
    const workflow = new CampaignWorkflow(db, ai, event.env);

    return await step.do('run-campaign', async () => {
      return await workflow.runCampaign(event.payload.campaignId);
    });
  }
}

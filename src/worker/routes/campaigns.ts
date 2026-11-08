import { Hono } from 'hono';
import { z } from 'zod';
import { getDatabase } from '../../lib/database/db';
import { CampaignsRepository } from '../../lib/database/campaigns.repo';
import { CampaignWorkflow } from '../workflows/campaign.workflow';
import { getAIProvider } from '../../lib/ai/factory';
import { validateBody } from '../middleware/validation';
import { logAudit } from '../../lib/audit/logger';

export const campaignsRouter = new Hono<{ Variables: { validatedBody: any } }>();

const CreateCampaignSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Campaign name is required'),
  settings: z.object({
    categories: z.array(z.string()).default(['startup_directory', 'product_directory', 'launch_platform']),
    include_paid: z.boolean().default(false),
    include_reddit: z.boolean().default(false),
    automation: z.enum(['maximum', 'approval_required']).default('maximum'),
    tracking: z.boolean().default(true),
  }),
});

campaignsRouter.get('/', async (c) => {
  const db = getDatabase(c.env);
  const repo = new CampaignsRepository(db);
  const productId = c.req.query('product_id');

  const campaigns = productId
    ? await repo.listByProduct(productId)
    : await repo.listAll();

  return c.json(campaigns);
});

campaignsRouter.post('/', validateBody(CreateCampaignSchema), async (c) => {
  const db = getDatabase(c.env);
  const repo = new CampaignsRepository(db);
  const body = c.get('validatedBody' as any) as any;

  const campaign = await repo.create(body.product_id, body.name, body.settings);
  await logAudit(db, {
    action: 'campaign_created',
    resourceType: 'campaign',
    resourceId: campaign.id,
    details: { name: campaign.name, productId: body.product_id },
  });

  return c.json(campaign, 201);
});

campaignsRouter.get('/:id', async (c) => {
  const db = getDatabase(c.env);
  const repo = new CampaignsRepository(db);
  const id = c.req.param('id');
  const campaign = await repo.findById(id);

  if (!campaign) {
    return c.json({ error: 'Campaign not found' }, 404);
  }

  const targets = await repo.listTargets(id);
  return c.json({ ...campaign, targets });
});

campaignsRouter.post('/:id/start', async (c) => {
  const db = getDatabase(c.env);
  const ai = getAIProvider(c.env);
  const campaignId = c.req.param('id');
  const workflow = new CampaignWorkflow(db, ai, c.env);

  try {
    const summary = await workflow.runCampaign(campaignId);
    return c.json({
      campaign_id: campaignId,
      status: 'generating',
      destinations_found: summary.destinationsFound,
      eligible: summary.eligible,
      requires_intervention: summary.requiresIntervention,
      restricted: summary.restricted,
      unverified: summary.unverified,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

campaignsRouter.get('/:id/results', async (c) => {
  const db = getDatabase(c.env);
  const repo = new CampaignsRepository(db);
  const campaignId = c.req.param('id');
  const targets = await repo.listTargets(campaignId);

  const stats = {
    total: targets.length,
    submitted: targets.filter(t => t.status === 'submitted' || t.status === 'approved').length,
    pending: targets.filter(t => t.status === 'pending' || t.status === 'queued' || t.status === 'ready').length,
    manual_action_required: targets.filter(t => t.status === 'manual_action_required').length,
    failed: targets.filter(t => t.status === 'failed').length,
    skipped: targets.filter(t => t.status === 'skipped').length,
  };

  return c.json({ campaign_id: campaignId, stats, targets });
});

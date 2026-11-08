import { Hono } from 'hono';
import { getDatabase } from '../../lib/database/db';
import { CampaignsRepository } from '../../lib/database/campaigns.repo';
import { SubmissionsRepository } from '../../lib/database/submissions.repo';
import { SubmissionWorkflow } from '../workflows/submission.workflow';
import { DeadLetterQueueRepository } from '../../lib/database/dlq.repo';
import { QueueProducer } from '../queue/producer';
import { logAudit } from '../../lib/audit/logger';

export const submissionsRouter = new Hono();

submissionsRouter.get('/', async (c) => {
  const db = getDatabase(c.env);
  const status = c.req.query('status');
  const limitParam = c.req.query('limit');
  const pageParam = c.req.query('page');

  const limit = limitParam ? Math.min(200, Math.max(1, parseInt(limitParam, 10))) : 100;
  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT
      t.id as target_id,
      t.campaign_id,
      t.destination_id,
      t.status,
      t.adapter_key,
      t.attempts,
      t.submission_url,
      t.external_submission_id,
      t.error_message,
      t.submitted_at,
      t.created_at,
      d.name as destination_name,
      d.category as destination_category,
      d.slug as destination_slug,
      c.name as campaign_name,
      p.id as product_id,
      p.name as product_name
    FROM campaign_targets t
    JOIN destinations d ON t.destination_id = d.id
    JOIN campaigns c ON t.campaign_id = c.id
    JOIN products p ON c.product_id = p.id
    WHERE 1=1
  `;
  const params: any[] = [];
  if (status) {
    sql += ` AND t.status = ?`;
    params.push(status);
  }
  sql += ` ORDER BY t.updated_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const res = await db.prepare(sql).bind(...params).all();
  return c.json(res.results || []);
});

// Dead Letter Queue (DLQ) Management Endpoints
submissionsRouter.get('/dlq', async (c) => {
  const db = getDatabase(c.env);
  const dlqRepo = new DeadLetterQueueRepository(db);
  const status = c.req.query('status') || 'pending';
  const items = await dlqRepo.list(status);
  return c.json(items);
});

submissionsRouter.post('/dlq/:id/replay', async (c) => {
  const db = getDatabase(c.env);
  const dlqRepo = new DeadLetterQueueRepository(db);
  const item = await dlqRepo.findById(c.req.param('id'));

  if (!item) {
    return c.json({ error: 'DLQ item not found' }, 404);
  }

  // Re-enqueue payload to Queue Producer
  const producer = new QueueProducer(c.env);
  const payload = JSON.parse(item.payload_json);
  await producer.send(payload);

  await dlqRepo.markStatus(item.id, 'replayed');
  await logAudit(db, {
    action: 'dlq_replayed',
    resourceType: 'dead_letter_queue',
    resourceId: item.id,
    details: { targetId: item.target_id, campaignId: item.campaign_id },
  });

  return c.json({ success: true, message: 'Message re-queued successfully' });
});

submissionsRouter.post('/targets/:id/execute', async (c) => {
  const db = getDatabase(c.env);
  const targetId = c.req.param('id');
  const workflow = new SubmissionWorkflow(db, c.env);

  try {
    const result = await workflow.executeTargetSubmission(targetId);
    return c.json(result);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

submissionsRouter.post('/targets/:id/retry', async (c) => {
  const db = getDatabase(c.env);
  const campaignsRepo = new CampaignsRepository(db);
  const targetId = c.req.param('id');
  const target = await campaignsRepo.findTargetById(targetId);

  if (!target) {
    return c.json({ error: 'Target not found' }, 404);
  }

  // Guard: Do not retry already submitted/approved targets
  if (target.status === 'submitted' || target.status === 'approved') {
    return c.json({ error: 'Target has already been successfully submitted. Duplicate submissions prevented.' }, 400);
  }

  const workflow = new SubmissionWorkflow(db, c.env);
  try {
    const result = await workflow.executeTargetSubmission(targetId);
    await logAudit(db, {
      action: 'submission_retried',
      resourceType: 'campaign_target',
      resourceId: targetId,
      details: { success: result.success },
    });
    return c.json(result);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

submissionsRouter.post('/targets/:id/intervention', async (c) => {
  const db = getDatabase(c.env);
  const campaignsRepo = new CampaignsRepository(db);
  const submissionsRepo = new SubmissionsRepository(db);
  const targetId = c.req.param('id');
  const body = await c.req.json();

  const target = await campaignsRepo.findTargetById(targetId);
  if (!target) {
    return c.json({ error: 'Target not found' }, 404);
  }

  // Update target based on user intervention
  const action = body.action || 'approved'; // 'approved' | 'manually_submitted' | 'rejected'

  if (action === 'manually_submitted') {
    await campaignsRepo.updateTargetStatus(targetId, 'submitted', {
      submittedAt: new Date().toISOString(),
      externalSubmissionId: body.external_submission_id || `manual_${Date.now()}`,
      errorMessage: undefined,
    });
    await submissionsRepo.recordAttempt({
      target_id: targetId,
      attempt_number: target.attempts + 1,
      method: 'manual',
      status: 'success',
      response_json: JSON.stringify({ manualUrl: body.confirmation_url }),
      confirmation_url: body.confirmation_url,
    });
  } else if (action === 'approved') {
    // Resume automated submission workflow
    const workflow = new SubmissionWorkflow(db, c.env);
    const result = await workflow.executeTargetSubmission(targetId);
    return c.json({ resumed: true, result });
  } else {
    await campaignsRepo.updateTargetStatus(targetId, 'skipped', {
      errorMessage: 'User declined or skipped intervention',
    });
  }

  await logAudit(db, {
    action: 'human_intervention_completed',
    resourceType: 'campaign_target',
    resourceId: targetId,
    details: { action, notes: body.notes },
  });

  return c.json({ success: true, targetId, action });
});

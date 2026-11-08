import { DatabaseClient } from './db';
import { SubmissionAttempt, Followup } from '../../types/submission';

export class SubmissionsRepository {
  constructor(private db: DatabaseClient) {}

  async recordAttempt(attempt: Omit<SubmissionAttempt, 'id' | 'started_at'>): Promise<SubmissionAttempt> {
    const id = 'att_' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();

    await this.db.prepare(
      `INSERT INTO submission_attempts (
        id, target_id, attempt_number, method, status, response_json,
        screenshot_key, confirmation_url, error_message, started_at, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      attempt.target_id,
      attempt.attempt_number,
      attempt.method,
      attempt.status,
      attempt.response_json || '{}',
      attempt.screenshot_key || null,
      attempt.confirmation_url || null,
      attempt.error_message || null,
      now,
      attempt.completed_at || now
    ).run();

    return {
      id,
      ...attempt,
      started_at: now,
    };
  }

  async listAttemptsByTarget(targetId: string): Promise<SubmissionAttempt[]> {
    const res = await this.db.prepare(
      `SELECT * FROM submission_attempts WHERE target_id = ? ORDER BY attempt_number DESC`
    ).bind(targetId).all<SubmissionAttempt>();
    return res.results || [];
  }

  async scheduleFollowup(targetId: string, followupType: 'status_check' | 'editorial_reminder' | 'verification', scheduledAt: string): Promise<Followup> {
    const id = 'fol_' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();

    await this.db.prepare(
      `INSERT INTO followups (id, target_id, followup_type, scheduled_at, status, result_json, created_at)
       VALUES (?, ?, ?, ?, 'pending', '{}', ?)`
    ).bind(id, targetId, followupType, scheduledAt, now).run();

    return {
      id,
      target_id: targetId,
      followup_type: followupType,
      scheduled_at: scheduledAt,
      status: 'pending',
      result_json: '{}',
      created_at: now,
    };
  }

  async listPendingFollowups(): Promise<Followup[]> {
    const now = new Date().toISOString();
    const res = await this.db.prepare(
      `SELECT * FROM followups WHERE status = 'pending' AND scheduled_at <= ? ORDER BY scheduled_at ASC`
    ).bind(now).all<Followup>();
    return res.results || [];
  }

  async recordAnalyticsEvent(productId: string, eventType: string, source?: string, campaignId?: string, targetId?: string, metadata?: Record<string, any>): Promise<void> {
    const id = 'evt_' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();
    const metaJson = JSON.stringify(metadata || {});

    await this.db.prepare(
      `INSERT INTO analytics_events (id, product_id, campaign_id, target_id, event_type, source, metadata_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, productId, campaignId || null, targetId || null, eventType, source || null, metaJson, now).run();
  }

  async getAnalytics(productId: string): Promise<any[]> {
    const res = await this.db.prepare(
      `SELECT * FROM analytics_events WHERE product_id = ? ORDER BY created_at DESC`
    ).bind(productId).all<any>();
    return res.results || [];
  }
}

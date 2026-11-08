import { DatabaseClient } from './db';
import { Campaign, CampaignSettings, CampaignTarget, ContentVariant, CampaignTargetStatus, CampaignStatus } from '../../types/campaign';

export class CampaignsRepository {
  constructor(private db: DatabaseClient) {}

  async create(productId: string, name: string, settings?: Partial<CampaignSettings>): Promise<Campaign> {
    const id = 'camp_' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();
    const defaultSettings: CampaignSettings = {
      categories: ['startup_directory', 'launch_platform'],
      include_paid: false,
      include_reddit: false,
      automation: 'maximum',
      tracking: true,
      ...(settings || {}),
    };
    const settingsJson = JSON.stringify(defaultSettings);

    await this.db.prepare(
      `INSERT INTO campaigns (id, product_id, name, status, settings_json, created_at)
       VALUES (?, ?, ?, 'draft', ?, ?)`
    ).bind(id, productId, name, settingsJson, now).run();

    return (await this.findById(id))!;
  }

  async findById(id: string): Promise<Campaign | null> {
    return this.db.prepare(`SELECT * FROM campaigns WHERE id = ?`).bind(id).first<Campaign>();
  }

  async listByProduct(productId: string): Promise<Campaign[]> {
    const res = await this.db.prepare(`SELECT * FROM campaigns WHERE product_id = ? ORDER BY created_at DESC`).bind(productId).all<Campaign>();
    return res.results || [];
  }

  async listAll(limit = 100, offset = 0): Promise<Campaign[]> {
    const res = await this.db.prepare(
      `SELECT * FROM campaigns ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).bind(limit, offset).all<Campaign>();
    return res.results || [];
  }

  async updateStatus(id: string, status: CampaignStatus): Promise<void> {
    const now = new Date().toISOString();
    let sql = `UPDATE campaigns SET status = ?`;
    const params: any[] = [status];

    if (status === 'in_progress') {
      sql += `, started_at = COALESCE(started_at, ?)`;
      params.push(now);
    } else if (status === 'completed') {
      sql += `, completed_at = ?`;
      params.push(now);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    await this.db.prepare(sql).bind(...params).run();
  }

  // Campaign Targets
  async addTarget(campaignId: string, destinationId: string, adapterKey?: string, submissionUrl?: string): Promise<CampaignTarget> {
    const id = 'tgt_' + crypto.randomUUID().slice(0, 8);
    const idempotencyKey = `idemp_${campaignId}_${destinationId}`;
    const now = new Date().toISOString();

    await this.db.prepare(
      `INSERT OR IGNORE INTO campaign_targets (
        id, campaign_id, destination_id, status, adapter_key,
        submission_url, idempotency_key, created_at, updated_at
      ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?)`
    ).bind(id, campaignId, destinationId, adapterKey || null, submissionUrl || null, idempotencyKey, now, now).run();

    return (await this.findTarget(campaignId, destinationId))!;
  }

  async bulkAddTargets(
    campaignId: string,
    targets: Array<{ destinationId: string; adapterKey?: string; submissionUrl?: string }>
  ): Promise<void> {
    if (targets.length === 0) return;
    const now = new Date().toISOString();
    const chunkSize = 40;
    for (let i = 0; i < targets.length; i += chunkSize) {
      const chunk = targets.slice(i, i + chunkSize);
      const valueClauses: string[] = [];
      const params: any[] = [];

      for (const t of chunk) {
        const id = 'tgt_' + crypto.randomUUID().slice(0, 8);
        const idempotencyKey = `idemp_${campaignId}_${t.destinationId}`;
        valueClauses.push(`(?, ?, ?, 'pending', ?, ?, ?, ?, ?)`);
        params.push(id, campaignId, t.destinationId, t.adapterKey || null, t.submissionUrl || null, idempotencyKey, now, now);
      }

      const sql = `INSERT OR IGNORE INTO campaign_targets (
        id, campaign_id, destination_id, status, adapter_key,
        submission_url, idempotency_key, created_at, updated_at
      ) VALUES ${valueClauses.join(', ')}`;

      await this.db.prepare(sql).bind(...params).run();
    }
  }

  async findTarget(campaignId: string, destinationId: string): Promise<CampaignTarget | null> {
    return this.db.prepare(
      `SELECT * FROM campaign_targets WHERE campaign_id = ? AND destination_id = ?`
    ).bind(campaignId, destinationId).first<CampaignTarget>();
  }

  async findTargetById(targetId: string): Promise<CampaignTarget | null> {
    return this.db.prepare(`SELECT * FROM campaign_targets WHERE id = ?`).bind(targetId).first<CampaignTarget>();
  }

  async listTargets(campaignId: string): Promise<CampaignTarget[]> {
    const res = await this.db.prepare(
      `SELECT * FROM campaign_targets WHERE campaign_id = ? ORDER BY created_at ASC`
    ).bind(campaignId).all<CampaignTarget>();
    return res.results || [];
  }

  async updateTargetStatus(
    targetId: string,
    status: CampaignTargetStatus,
    extra?: {
      adapterKey?: string;
      contentId?: string;
      externalSubmissionId?: string;
      errorCode?: string;
      errorMessage?: string;
      submittedAt?: string;
      incrementAttempts?: boolean;
    }
  ): Promise<void> {
    const now = new Date().toISOString();
    let sql = `UPDATE campaign_targets SET status = ?, updated_at = ?`;
    const params: any[] = [status, now];

    if (extra?.adapterKey) {
      sql += `, adapter_key = ?`;
      params.push(extra.adapterKey);
    }
    if (extra?.contentId) {
      sql += `, content_id = ?`;
      params.push(extra.contentId);
    }
    if (extra?.externalSubmissionId) {
      sql += `, external_submission_id = ?`;
      params.push(extra.externalSubmissionId);
    }
    if (extra?.errorCode !== undefined) {
      sql += `, error_code = ?`;
      params.push(extra.errorCode);
    }
    if (extra?.errorMessage !== undefined) {
      sql += `, error_message = ?`;
      params.push(extra.errorMessage);
    }
    if (extra?.submittedAt) {
      sql += `, submitted_at = ?`;
      params.push(extra.submittedAt);
    }
    if (extra?.incrementAttempts) {
      sql += `, attempts = attempts + 1`;
    }

    sql += ` WHERE id = ?`;
    params.push(targetId);

    await this.db.prepare(sql).bind(...params).run();
  }

  // Content Variants
  async saveContentVariant(variant: Omit<ContentVariant, 'id' | 'created_at'>): Promise<ContentVariant> {
    const id = 'cnt_' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();

    await this.db.prepare(
      `INSERT INTO content_variants (
        id, target_id, version, title, tagline, description, body,
        tags_json, fields_json, model_name, quality_score, validation_status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      variant.target_id,
      variant.version,
      variant.title || null,
      variant.tagline || null,
      variant.description || null,
      variant.body || null,
      variant.tags_json || '[]',
      variant.fields_json || '{}',
      variant.model_name || null,
      variant.quality_score ?? 1.0,
      variant.validation_status || 'pending',
      now
    ).run();

    // Link content_id to target
    await this.db.prepare(`UPDATE campaign_targets SET content_id = ? WHERE id = ?`).bind(id, variant.target_id).run();

    return {
      id,
      ...variant,
      created_at: now,
    };
  }

  async getContentVariant(targetId: string): Promise<ContentVariant | null> {
    return this.db.prepare(`SELECT * FROM content_variants WHERE target_id = ? ORDER BY version DESC LIMIT 1`).bind(targetId).first<ContentVariant>();
  }
}

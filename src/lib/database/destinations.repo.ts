import { DatabaseClient } from './db';
import { Destination, DestinationCheck, DestinationFilter, DestinationStatus } from '../../types/destination';

export class DestinationsRepository {
  constructor(private db: DatabaseClient) {}

  async upsert(destination: Partial<Destination> & { name: string; slug: string; category: string }): Promise<Destination> {
    const existing = await this.findBySlug(destination.slug);
    const now = new Date().toISOString();

    if (existing) {
      await this.db.prepare(
        `UPDATE destinations SET
          name = ?, source_url = COALESCE(?, source_url),
          submission_url = COALESCE(?, submission_url),
          category = ?, submission_method = COALESCE(?, submission_method),
          automation_policy = COALESCE(?, automation_policy),
          pricing_type = COALESCE(?, pricing_type),
          requirements_json = COALESCE(?, requirements_json),
          adapter_key = COALESCE(?, adapter_key),
          confidence = COALESCE(?, confidence),
          status = COALESCE(?, status),
          updated_at = ?
        WHERE id = ?`
      ).bind(
        destination.name,
        destination.source_url || null,
        destination.submission_url || null,
        destination.category,
        destination.submission_method || null,
        destination.automation_policy || null,
        destination.pricing_type || null,
        destination.requirements_json || null,
        destination.adapter_key || null,
        destination.confidence ?? null,
        destination.status || null,
        now,
        existing.id
      ).run();

      return (await this.findById(existing.id))!;
    } else {
      const id = 'dest_' + crypto.randomUUID().slice(0, 8);
      await this.db.prepare(
        `INSERT INTO destinations (
          id, name, slug, source_url, submission_url, category,
          submission_method, automation_policy, pricing_type, pricing_amount,
          requirements_json, form_schema_json, adapter_key, policy_url,
          evidence_json, confidence, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id,
        destination.name,
        destination.slug,
        destination.source_url || null,
        destination.submission_url || null,
        destination.category,
        destination.submission_method || 'unknown',
        destination.automation_policy || 'unknown',
        destination.pricing_type || 'unknown',
        destination.pricing_amount ?? null,
        destination.requirements_json || '{}',
        destination.form_schema_json || '{}',
        destination.adapter_key || null,
        destination.policy_url || null,
        destination.evidence_json || '[]',
        destination.confidence ?? 0,
        destination.status || 'unverified',
        now,
        now
      ).run();

      return (await this.findById(id))!;
    }
  }

  async findById(id: string): Promise<Destination | null> {
    return this.db.prepare(`SELECT * FROM destinations WHERE id = ?`).bind(id).first<Destination>();
  }

  async findBySlug(slug: string): Promise<Destination | null> {
    return this.db.prepare(`SELECT * FROM destinations WHERE slug = ?`).bind(slug).first<Destination>();
  }

  async list(filter?: DestinationFilter): Promise<Destination[]> {
    let sql = `SELECT * FROM destinations WHERE 1=1`;
    const params: any[] = [];

    if (filter?.category) {
      sql += ` AND category = ?`;
      params.push(filter.category);
    }
    if (filter?.status) {
      sql += ` AND status = ?`;
      params.push(filter.status);
    }
    if (filter?.automation_policy) {
      sql += ` AND automation_policy = ?`;
      params.push(filter.automation_policy);
    }
    if (filter?.pricing_type) {
      sql += ` AND pricing_type = ?`;
      params.push(filter.pricing_type);
    }
    if (filter?.search) {
      sql += ` AND (name LIKE ? OR slug LIKE ? OR category LIKE ?)`;
      const s = `%${filter.search}%`;
      params.push(s, s, s);
    }

    sql += ` ORDER BY confidence DESC, name ASC`;
    const res = await this.db.prepare(sql).bind(...params).all<Destination>();
    return res.results || [];
  }

  async updateStatus(id: string, status: DestinationStatus, confidence?: number, lastCheckedAt?: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db.prepare(
      `UPDATE destinations SET
        status = ?,
        confidence = COALESCE(?, confidence),
        last_checked_at = COALESCE(?, last_checked_at),
        updated_at = ?
      WHERE id = ?`
    ).bind(status, confidence ?? null, lastCheckedAt || now, now, id).run();
  }

  async recordCheck(check: Omit<DestinationCheck, 'id' | 'checked_at'>): Promise<DestinationCheck> {
    const id = 'chk_' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();
    await this.db.prepare(
      `INSERT INTO destination_checks (id, destination_id, check_status, http_status, final_url, evidence_json, checked_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      check.destination_id,
      check.check_status,
      check.http_status || null,
      check.final_url || null,
      check.evidence_json || '{}',
      now
    ).run();

    return {
      id,
      ...check,
      checked_at: now,
    };
  }

  async getChecks(destinationId: string): Promise<DestinationCheck[]> {
    const res = await this.db.prepare(
      `SELECT * FROM destination_checks WHERE destination_id = ? ORDER BY checked_at DESC`
    ).bind(destinationId).all<DestinationCheck>();
    return res.results || [];
  }

  async countStats(): Promise<{ total: number; verified: number; restricted: number; unverified: number }> {
    const total = (await this.db.prepare(`SELECT count(*) as count FROM destinations`).first<any>())?.count || 0;
    const verified = (await this.db.prepare(`SELECT count(*) as count FROM destinations WHERE status = 'verified'`).first<any>())?.count || 0;
    const restricted = (await this.db.prepare(`SELECT count(*) as count FROM destinations WHERE status = 'restricted'`).first<any>())?.count || 0;
    const unverified = (await this.db.prepare(`SELECT count(*) as count FROM destinations WHERE status = 'unverified'`).first<any>())?.count || 0;

    return { total, verified, restricted, unverified };
  }
}

import { DatabaseClient } from './db';

export interface DeadLetterItem {
  id: string;
  queue_name: string;
  target_id?: string;
  campaign_id?: string;
  destination_id?: string;
  payload_json: string;
  error_reason: string;
  stack_trace?: string;
  retry_count: number;
  status: 'pending' | 'replayed' | 'discarded';
  created_at?: string;
  updated_at?: string;
}

export class DeadLetterQueueRepository {
  constructor(private db: DatabaseClient) {}

  async enqueue(item: {
    queueName: string;
    targetId?: string;
    campaignId?: string;
    destinationId?: string;
    payload: any;
    errorReason: string;
    stackTrace?: string;
    retryCount?: number;
  }): Promise<string> {
    const id = 'dlq_' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();

    await this.db.prepare(
      `INSERT INTO dead_letter_queue (
        id, queue_name, target_id, campaign_id, destination_id,
        payload_json, error_reason, stack_trace, retry_count,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
    ).bind(
      id,
      item.queueName,
      item.targetId || null,
      item.campaignId || null,
      item.destinationId || null,
      typeof item.payload === 'string' ? item.payload : JSON.stringify(item.payload),
      item.errorReason,
      item.stackTrace || null,
      item.retryCount || 0,
      now,
      now
    ).run();

    return id;
  }

  async list(status: string = 'pending', limit = 50, offset = 0): Promise<DeadLetterItem[]> {
    const res = await this.db.prepare(
      `SELECT * FROM dead_letter_queue WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).bind(status, limit, offset).all<DeadLetterItem>();
    return res.results || [];
  }

  async findById(id: string): Promise<DeadLetterItem | null> {
    return this.db.prepare(
      `SELECT * FROM dead_letter_queue WHERE id = ?`
    ).bind(id).first<DeadLetterItem>();
  }

  async markStatus(id: string, status: 'replayed' | 'discarded'): Promise<void> {
    const now = new Date().toISOString();
    await this.db.prepare(
      `UPDATE dead_letter_queue SET status = ?, updated_at = ? WHERE id = ?`
    ).bind(status, now, id).run();
  }

  async countPending(): Promise<number> {
    const row = await this.db.prepare(
      `SELECT COUNT(*) as count FROM dead_letter_queue WHERE status = 'pending'`
    ).first<{ count: number }>();
    return row?.count || 0;
  }
}

/**
 * Audit Logger
 * Records security-sensitive operations, submissions, status transitions,
 * and human intervention events.
 */

export interface AuditLogEntry {
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, any>;
}

export async function logAudit(
  db: any,
  entry: AuditLogEntry
): Promise<void> {
  try {
    const id = 'audit_' + crypto.randomUUID();
    const detailsJson = JSON.stringify(entry.details || {});
    await db.prepare(
      `INSERT INTO audit_logs (id, action, resource_type, resource_id, details_json)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(
      id,
      entry.action,
      entry.resourceType || null,
      entry.resourceId || null,
      detailsJson
    ).run();
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

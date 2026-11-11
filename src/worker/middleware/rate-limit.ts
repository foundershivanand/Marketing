import { Context, Next } from 'hono';

const requestCounts = new Map<string, { count: number; resetTime: number }>();
const MAX_TRACKED_IPS = 5000;

function pruneExpired(now: number) {
  if (requestCounts.size > MAX_TRACKED_IPS) {
    for (const [key, record] of requestCounts.entries()) {
      if (now > record.resetTime) {
        requestCounts.delete(key);
      }
    }
    // If still over capacity, evict oldest
    if (requestCounts.size > MAX_TRACKED_IPS) {
      const keysToDelete = Array.from(requestCounts.keys()).slice(0, 1000);
      for (const k of keysToDelete) {
        requestCounts.delete(k);
      }
    }
  }
}

export function rateLimit(limit: number = 100, windowMs: number = 60000) {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'local';
    const now = Date.now();

    pruneExpired(now);

    const record = requestCounts.get(ip);
    if (!record || now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= limit) {
      return c.json({ error: 'Too many requests. Please slow down.' }, 429);
    }

    record.count++;
    return next();
  };
}

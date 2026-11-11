import { Context, Next } from 'hono';

export async function authMiddleware(c: Context, next: Next) {
  // In automated test mode, permit access
  if (process.env.NODE_ENV === 'test') {
    return next();
  }

  const allowedEmail = c.env?.ALLOWED_ADMIN_EMAIL || process.env.ALLOWED_ADMIN_EMAIL;
  const adminToken = c.env?.ADMIN_TOKEN || c.env?.API_SECRET || process.env.ADMIN_TOKEN || process.env.API_SECRET;

  // Cloudflare Access Zero Trust email verification
  const cfAccessEmail = c.req.header('cf-access-authenticated-user-email');
  if (cfAccessEmail && allowedEmail) {
    const allowedList = allowedEmail.split(',').map((e: string) => e.trim().toLowerCase());
    if (allowedList.includes(cfAccessEmail.toLowerCase())) {
      return next();
    }
  }

  // Dedicated Bearer API Token authorization (separated from encryption keys)
  const authHeader = c.req.header('authorization');
  if (authHeader && authHeader.startsWith('Bearer ') && adminToken) {
    const token = authHeader.substring(7);
    if (token === adminToken) {
      return next();
    }
  }

  // If running in local development mode without configured credentials, permit
  if (process.env.NODE_ENV !== 'production' && !allowedEmail && !adminToken) {
    return next();
  }

  return c.json({ error: 'Unauthorized. Cloudflare Access or Admin Bearer Token verification required.' }, 401);
}

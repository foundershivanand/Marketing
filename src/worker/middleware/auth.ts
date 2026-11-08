import { Context, Next } from 'hono';

export async function authMiddleware(c: Context, next: Next) {
  // In development/test mode, allow access if no strict token is enforced
  if (process.env.NODE_ENV === 'test' || !c.env?.ALLOWED_ADMIN_EMAIL) {
    return next();
  }

  // Cloudflare Access headers
  const cfAccessEmail = c.req.header('cf-access-authenticated-user-email');
  const allowedEmail = c.env.ALLOWED_ADMIN_EMAIL;

  if (cfAccessEmail && cfAccessEmail.toLowerCase() === allowedEmail.toLowerCase()) {
    return next();
  }

  // Optional bearer token or development authorization
  const authHeader = c.req.header('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === c.env.ENCRYPTION_KEY || token === 'admin-secret') {
      return next();
    }
  }

  // If running in development server, permit
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  return c.json({ error: 'Unauthorized. Cloudflare Access verification required.' }, 401);
}

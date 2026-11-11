import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { authMiddleware } from '../../src/worker/middleware/auth';

describe('Authentication & Authorization Middleware Hardening', () => {
  function createTestApp(env: any = {}) {
    const testApp = new Hono();
    testApp.use('/protected/*', async (c, next) => {
      // Pass test env to context
      (c as any).env = env;
      return authMiddleware(c, next);
    });
    testApp.get('/protected/resource', (c) => c.json({ ok: true }));
    return testApp;
  }

  it('rejects obsolete hardcoded "admin-secret" bypass token', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const app = createTestApp({
        ADMIN_TOKEN: 'super-secure-production-token-12345',
        ALLOWED_ADMIN_EMAIL: 'admin@example.com',
      });

      const res = await app.request('/protected/resource', {
        headers: { Authorization: 'Bearer admin-secret' },
      });

      expect(res.status).toBe(401);
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('rejects ENCRYPTION_KEY when used as an API bearer token', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const encryptionKey = '0123456789abcdef0123456789abcdef';
      const app = createTestApp({
        ENCRYPTION_KEY: encryptionKey,
        ADMIN_TOKEN: 'valid-api-token-999',
        ALLOWED_ADMIN_EMAIL: 'admin@example.com',
      });

      const res = await app.request('/protected/resource', {
        headers: { Authorization: `Bearer ${encryptionKey}` },
      });

      expect(res.status).toBe(401);
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('authorizes requests with a valid ADMIN_TOKEN', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const app = createTestApp({
        ADMIN_TOKEN: 'valid-api-token-999',
        ALLOWED_ADMIN_EMAIL: 'admin@example.com',
      });

      const res = await app.request('/protected/resource', {
        headers: { Authorization: 'Bearer valid-api-token-999' },
      });

      expect(res.status).toBe(200);
      const data: any = await res.json();
      expect(data.ok).toBe(true);
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('authorizes requests with matching Cloudflare Access authenticated email', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const app = createTestApp({
        ADMIN_TOKEN: 'valid-api-token-999',
        ALLOWED_ADMIN_EMAIL: 'founder@launchpilot.com, admin@example.com',
      });

      const res = await app.request('/protected/resource', {
        headers: { 'cf-access-authenticated-user-email': 'founder@launchpilot.com' },
      });

      expect(res.status).toBe(200);
      const data: any = await res.json();
      expect(data.ok).toBe(true);
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });
});

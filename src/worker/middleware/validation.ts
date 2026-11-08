import { Context, Next } from 'hono';
import { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: 'Validation failed', details: parsed.error.issues }, 400);
      }
      c.set('validatedBody', parsed.data);
      return next();
    } catch {
      return c.json({ error: 'Invalid JSON request body' }, 400);
    }
  };
}

import { Hono } from 'hono';
import { z } from 'zod';
import { getDatabase } from '../../lib/database/db';
import { ProductsRepository } from '../../lib/database/products.repo';
import { validateBody } from '../middleware/validation';
import { logAudit } from '../../lib/audit/logger';

export const productsRouter = new Hono<{ Variables: { validatedBody: any } }>();

const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  website_url: z.string().url('A valid website URL is required'),
  tagline: z.string().optional(),
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  target_audience: z.string().optional(),
  category: z.string().optional(),
  pricing_model: z.string().optional(),
  founder_name: z.string().optional(),
  founder_email: z.string().email().optional().or(z.literal('')),
  founder_bio: z.string().optional(),
  social_links: z.record(z.string()).optional(),
  facts: z.array(z.string()).optional(),
  prohibited_claims: z.array(z.string()).optional(), // "Things AI must never claim"
});

productsRouter.get('/', async (c) => {
  const db = getDatabase(c.env);
  const repo = new ProductsRepository(db);
  const products = await repo.list();
  return c.json(products);
});

productsRouter.post('/', validateBody(CreateProductSchema), async (c) => {
  const db = getDatabase(c.env);
  const repo = new ProductsRepository(db);
  const body = c.get('validatedBody' as any) as any;

  const product = await repo.create(body);
  await logAudit(db, {
    action: 'product_created',
    resourceType: 'product',
    resourceId: product.id,
    details: { name: product.name },
  });

  return c.json(product, 201);
});

productsRouter.get('/:id', async (c) => {
  const db = getDatabase(c.env);
  const repo = new ProductsRepository(db);
  const product = await repo.findById(c.req.param('id'));

  if (!product) {
    return c.json({ error: 'Product not found' }, 404);
  }

  const assets = await repo.listAssets(product.id);
  return c.json({ ...product, assets });
});

productsRouter.patch('/:id', async (c) => {
  const db = getDatabase(c.env);
  const repo = new ProductsRepository(db);
  const id = c.req.param('id');
  const body = await c.req.json();

  const updated = await repo.update({ id, ...body });
  if (!updated) {
    return c.json({ error: 'Product not found' }, 404);
  }

  await logAudit(db, {
    action: 'product_updated',
    resourceType: 'product',
    resourceId: id,
  });

  return c.json(updated);
});

productsRouter.post('/:id/assets', async (c) => {
  const db = getDatabase(c.env);
  const repo = new ProductsRepository(db);
  const productId = c.req.param('id');
  const body = await c.req.json();

  const asset = await repo.addAsset(
    productId,
    body.asset_type || 'screenshot',
    body.r2_key || `assets/${productId}_${Date.now()}`,
    body.public_url,
    body.metadata
  );

  return c.json(asset, 201);
});

import { DatabaseClient } from './db';
import { Product, CreateProductInput, UpdateProductInput, ProductAsset } from '../../types/product';

export class ProductsRepository {
  constructor(private db: DatabaseClient) {}

  async create(input: CreateProductInput): Promise<Product> {
    const id = 'prod_' + crypto.randomUUID().slice(0, 8);
    let slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existingSlug = await this.findBySlug(slug);
    if (existingSlug) {
      slug = `${slug}-${crypto.randomUUID().slice(0, 4)}`;
    }
    const now = new Date().toISOString();

    const socialLinksJson = JSON.stringify(input.social_links || {});
    const factsJson = JSON.stringify(input.facts || []);
    const prohibitedClaimsJson = JSON.stringify(input.prohibited_claims || (input as any).negative_constraints || []);

    await this.db.prepare(
      `INSERT INTO products (
        id, name, slug, website_url, tagline, short_description,
        full_description, target_audience, category, pricing_model,
        founder_name, founder_email, founder_bio, social_links_json,
        facts_json, prohibited_claims_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, input.name, slug, input.website_url, input.tagline || null,
      input.short_description || null, input.full_description || null,
      input.target_audience || null, input.category || null,
      input.pricing_model || null, input.founder_name || null,
      input.founder_email || null, input.founder_bio || null,
      socialLinksJson, factsJson, prohibitedClaimsJson, now, now
    ).run();

    return this.findById(id) as Promise<Product>;
  }

  async findById(id: string): Promise<Product | null> {
    return this.db.prepare(`SELECT * FROM products WHERE id = ?`).bind(id).first<Product>();
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.db.prepare(`SELECT * FROM products WHERE slug = ?`).bind(slug).first<Product>();
  }

  async list(): Promise<Product[]> {
    const res = await this.db.prepare(`SELECT * FROM products ORDER BY created_at DESC`).all<Product>();
    return res.results || [];
  }

  async update(input: UpdateProductInput): Promise<Product | null> {
    const current = await this.findById(input.id);
    if (!current) return null;

    const now = new Date().toISOString();
    const updated: Product = {
      ...current,
      name: input.name ?? current.name,
      website_url: input.website_url ?? current.website_url,
      tagline: input.tagline ?? current.tagline,
      short_description: input.short_description ?? current.short_description,
      full_description: input.full_description ?? current.full_description,
      target_audience: input.target_audience ?? current.target_audience,
      category: input.category ?? current.category,
      pricing_model: input.pricing_model ?? current.pricing_model,
      founder_name: input.founder_name ?? current.founder_name,
      founder_email: input.founder_email ?? current.founder_email,
      founder_bio: input.founder_bio ?? current.founder_bio,
      social_links_json: input.social_links ? JSON.stringify(input.social_links) : current.social_links_json,
      facts_json: input.facts ? JSON.stringify(input.facts) : current.facts_json,
      prohibited_claims_json: input.prohibited_claims ? JSON.stringify(input.prohibited_claims) : current.prohibited_claims_json,
      updated_at: now,
    };

    await this.db.prepare(
      `UPDATE products SET
        name = ?, website_url = ?, tagline = ?, short_description = ?,
        full_description = ?, target_audience = ?, category = ?, pricing_model = ?,
        founder_name = ?, founder_email = ?, founder_bio = ?, social_links_json = ?,
        facts_json = ?, prohibited_claims_json = ?, updated_at = ?
      WHERE id = ?`
    ).bind(
      updated.name, updated.website_url, updated.tagline, updated.short_description,
      updated.full_description, updated.target_audience, updated.category, updated.pricing_model,
      updated.founder_name, updated.founder_email, updated.founder_bio, updated.social_links_json,
      updated.facts_json, updated.prohibited_claims_json, updated.updated_at, updated.id
    ).run();

    return updated;
  }

  async addAsset(productId: string, assetType: 'logo' | 'screenshot' | 'demo' | 'document', r2Key: string, publicUrl?: string, metadata?: Record<string, any>): Promise<ProductAsset> {
    const id = 'asset_' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();
    const metaJson = JSON.stringify(metadata || {});

    await this.db.prepare(
      `INSERT INTO product_assets (id, product_id, asset_type, r2_key, public_url, metadata_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, productId, assetType, r2Key, publicUrl || null, metaJson, now).run();

    return {
      id,
      product_id: productId,
      asset_type: assetType,
      r2_key: r2Key,
      public_url: publicUrl,
      metadata_json: metaJson,
      created_at: now,
    };
  }

  async listAssets(productId: string): Promise<ProductAsset[]> {
    const res = await this.db.prepare(`SELECT * FROM product_assets WHERE product_id = ? ORDER BY created_at ASC`).bind(productId).all<ProductAsset>();
    return res.results || [];
  }
}

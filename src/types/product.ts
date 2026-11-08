export interface Product {
  id: string;
  name: string;
  slug: string;
  website_url: string;
  tagline?: string;
  short_description?: string;
  full_description?: string;
  target_audience?: string;
  category?: string;
  pricing_model?: string;
  founder_name?: string;
  founder_email?: string;
  founder_bio?: string;
  social_links_json: string; // JSON Record<string, string>
  facts_json: string; // JSON string[]
  prohibited_claims_json: string; // JSON string[] ("Things AI must never claim")
  created_at?: string;
  updated_at?: string;
}

export interface ProductAsset {
  id: string;
  product_id: string;
  asset_type: 'logo' | 'screenshot' | 'demo' | 'document';
  r2_key: string;
  public_url?: string;
  metadata_json: string;
  created_at?: string;
}

export interface CreateProductInput {
  name: string;
  website_url: string;
  tagline?: string;
  short_description?: string;
  full_description?: string;
  target_audience?: string;
  category?: string;
  pricing_model?: string;
  founder_name?: string;
  founder_email?: string;
  founder_bio?: string;
  social_links?: Record<string, string>;
  facts?: string[];
  prohibited_claims?: string[]; // "Things AI must never claim"
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

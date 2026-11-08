-- 0001_initial_schema.sql
-- LaunchPilot Complete Database Schema (Cloudflare D1 / SQLite)

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  website_url TEXT NOT NULL,
  tagline TEXT,
  short_description TEXT,
  full_description TEXT,
  target_audience TEXT,
  category TEXT,
  pricing_model TEXT,
  founder_name TEXT,
  founder_email TEXT,
  founder_bio TEXT,
  social_links_json TEXT DEFAULT '{}',
  facts_json TEXT DEFAULT '[]',
  prohibited_claims_json TEXT DEFAULT '[]',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_assets (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  public_url TEXT,
  metadata_json TEXT DEFAULT '{}',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  source_url TEXT,
  submission_url TEXT,
  category TEXT NOT NULL,
  submission_method TEXT DEFAULT 'unknown',
  automation_policy TEXT DEFAULT 'unknown',
  pricing_type TEXT DEFAULT 'unknown',
  pricing_amount REAL,
  requirements_json TEXT DEFAULT '{}',
  form_schema_json TEXT DEFAULT '{}',
  adapter_key TEXT,
  policy_url TEXT,
  evidence_json TEXT DEFAULT '[]',
  confidence REAL DEFAULT 0,
  status TEXT DEFAULT 'unverified',
  last_checked_at TEXT,
  next_check_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS destination_checks (
  id TEXT PRIMARY KEY,
  destination_id TEXT NOT NULL,
  check_status TEXT NOT NULL,
  http_status INTEGER,
  final_url TEXT,
  evidence_json TEXT DEFAULT '{}',
  checked_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(destination_id) REFERENCES destinations(id)
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  settings_json TEXT DEFAULT '{}',
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS campaign_targets (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  destination_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  adapter_key TEXT,
  content_id TEXT,
  submission_url TEXT,
  external_submission_id TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,
  scheduled_at TEXT,
  submitted_at TEXT,
  error_code TEXT,
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, destination_id),
  FOREIGN KEY(campaign_id) REFERENCES campaigns(id),
  FOREIGN KEY(destination_id) REFERENCES destinations(id)
);

CREATE TABLE IF NOT EXISTS content_variants (
  id TEXT PRIMARY KEY,
  target_id TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  title TEXT,
  tagline TEXT,
  description TEXT,
  body TEXT,
  tags_json TEXT DEFAULT '[]',
  fields_json TEXT DEFAULT '{}',
  model_name TEXT,
  quality_score REAL,
  validation_status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(target_id) REFERENCES campaign_targets(id)
);

CREATE TABLE IF NOT EXISTS submission_attempts (
  id TEXT PRIMARY KEY,
  target_id TEXT NOT NULL,
  attempt_number INTEGER NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL,
  response_json TEXT DEFAULT '{}',
  screenshot_key TEXT,
  confirmation_url TEXT,
  error_message TEXT,
  started_at TEXT DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY(target_id) REFERENCES campaign_targets(id)
);

CREATE TABLE IF NOT EXISTS followups (
  id TEXT PRIMARY KEY,
  target_id TEXT NOT NULL,
  followup_type TEXT NOT NULL,
  scheduled_at TEXT,
  status TEXT DEFAULT 'pending',
  result_json TEXT DEFAULT '{}',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(target_id) REFERENCES campaign_targets(id)
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  campaign_id TEXT,
  target_id TEXT,
  event_type TEXT NOT NULL,
  source TEXT,
  metadata_json TEXT DEFAULT '{}',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details_json TEXT DEFAULT '{}',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_destinations_status
ON destinations(status);

CREATE INDEX IF NOT EXISTS idx_destinations_category
ON destinations(category);

CREATE INDEX IF NOT EXISTS idx_targets_status
ON campaign_targets(status);

CREATE INDEX IF NOT EXISTS idx_targets_campaign
ON campaign_targets(campaign_id);

CREATE INDEX IF NOT EXISTS idx_checks_destination
ON destination_checks(destination_id);

CREATE INDEX IF NOT EXISTS idx_followups_schedule
ON followups(status, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_analytics_product
ON analytics_events(product_id, created_at);

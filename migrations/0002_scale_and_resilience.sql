-- 0002_scale_and_resilience.sql
-- Enterprise Scaling & Resilience Enhancements (Cloudflare D1 / SQLite)
-- Supports 100k+ Users, Rate-Limiting, Dead-Letter Queues, and Composite Indexing

-- Destination Throttles & Circuit Breaker Table
CREATE TABLE IF NOT EXISTS destination_throttles (
  destination_id TEXT PRIMARY KEY,
  consecutive_failures INTEGER DEFAULT 0,
  last_attempt_at TEXT,
  cooldown_until TEXT,
  rate_limit_per_hour INTEGER DEFAULT 12,
  active_concurrent INTEGER DEFAULT 0,
  status TEXT DEFAULT 'healthy', -- 'healthy' | 'degraded' | 'cooldown' | 'blocked'
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(destination_id) REFERENCES destinations(id)
);

-- Dead Letter Queue (DLQ) Table for Poison Messages & Failed Jobs
CREATE TABLE IF NOT EXISTS dead_letter_queue (
  id TEXT PRIMARY KEY,
  queue_name TEXT NOT NULL,
  target_id TEXT,
  campaign_id TEXT,
  destination_id TEXT,
  payload_json TEXT NOT NULL,
  error_reason TEXT NOT NULL,
  stack_trace TEXT,
  retry_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending' | 'replayed' | 'discarded'
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- High-Scale Composite Indexes for Bounded Queries at 100,000+ Records
CREATE INDEX IF NOT EXISTS idx_targets_dest_status
ON campaign_targets(destination_id, status);

CREATE INDEX IF NOT EXISTS idx_targets_camp_status
ON campaign_targets(campaign_id, status);

CREATE INDEX IF NOT EXISTS idx_targets_updated
ON campaign_targets(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_submission_attempts_target_status
ON submission_attempts(target_id, status);

CREATE INDEX IF NOT EXISTS idx_submission_attempts_started
ON submission_attempts(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_campaign_created
ON analytics_events(campaign_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_source_created
ON analytics_events(source, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_campaigns_product_status
ON campaigns(product_id, status);

CREATE INDEX IF NOT EXISTS idx_content_variants_target_valid
ON content_variants(target_id, validation_status);

CREATE INDEX IF NOT EXISTS idx_dlq_status
ON dead_letter_queue(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_throttles_status
ON destination_throttles(status, cooldown_until);

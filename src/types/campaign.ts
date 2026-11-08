export type CampaignStatus = 'draft' | 'generating' | 'ready' | 'in_progress' | 'completed' | 'paused';

export type CampaignTargetStatus =
  | 'pending'
  | 'researching'
  | 'generating'
  | 'ready'
  | 'queued'
  | 'submitting'
  | 'submitted'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'failed'
  | 'manual_action_required'
  | 'skipped';

export interface CampaignSettings {
  categories: string[];
  include_paid: boolean;
  include_reddit: boolean;
  automation: 'maximum' | 'approval_required';
  tracking: boolean;
  max_concurrent?: number;
}

export interface Campaign {
  id: string;
  product_id: string;
  name: string;
  status: CampaignStatus;
  settings_json: string; // CampaignSettings JSON
  started_at?: string;
  completed_at?: string;
  created_at?: string;
}

export interface CampaignTarget {
  id: string;
  campaign_id: string;
  destination_id: string;
  status: CampaignTargetStatus;
  adapter_key?: string;
  content_id?: string;
  submission_url?: string;
  external_submission_id?: string;
  idempotency_key: string;
  scheduled_at?: string;
  submitted_at?: string;
  error_code?: string;
  error_message?: string;
  attempts: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContentVariant {
  id: string;
  target_id: string;
  version: number;
  title?: string;
  tagline?: string;
  description?: string;
  body?: string;
  tags_json: string; // string[]
  fields_json: string; // Record<string, any>
  model_name?: string;
  quality_score?: number;
  validation_status: 'pending' | 'valid' | 'invalid' | 'warning';
  created_at?: string;
}

export type DestinationCategory =
  | 'startup_directory'
  | 'product_directory'
  | 'reddit'
  | 'email_pitch'
  | 'launch_platform'
  | 'editorial'
  | 'community';

export type SubmissionMethod = 'form' | 'api' | 'email' | 'manual' | 'unknown';

export type AutomationPolicy = 'allowed' | 'requires_review' | 'prohibited' | 'unknown';

export type PricingType = 'free' | 'freemium' | 'paid' | 'unknown';

export type DestinationStatus = 'unverified' | 'verified' | 'paused' | 'inactive' | 'restricted';

export interface Destination {
  id: string;
  name: string;
  slug: string;
  source_url?: string;
  submission_url?: string;
  category: DestinationCategory;
  submission_method: SubmissionMethod;
  automation_policy: AutomationPolicy;
  pricing_type: PricingType;
  pricing_amount?: number;
  requirements_json: string; // JSON object with character limits, fields
  form_schema_json: string; // JSON schema of the submission form
  adapter_key?: string;
  policy_url?: string;
  evidence_json: string; // JSON array of evidence URLs
  confidence: number;
  status: DestinationStatus;
  last_checked_at?: string;
  next_check_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DestinationCheck {
  id: string;
  destination_id: string;
  check_status: string;
  http_status?: number;
  final_url?: string;
  evidence_json: string;
  checked_at?: string;
}

export interface DestinationFilter {
  category?: string;
  status?: DestinationStatus;
  automation_policy?: AutomationPolicy;
  pricing_type?: PricingType;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface DestinationThrottle {
  destination_id: string;
  consecutive_failures: number;
  last_attempt_at?: string;
  cooldown_until?: string;
  rate_limit_per_hour: number;
  active_concurrent: number;
  status: 'healthy' | 'degraded' | 'cooldown' | 'blocked';
  updated_at?: string;
}

import { Product } from './product';
import { Destination } from './destination';

export interface ResearchAgentInput {
  name: string;
  sourceUrl?: string;
  submissionUrl?: string;
  category?: string;
  htmlSample?: string;
}

export interface ResearchAgentOutput {
  active: boolean;
  official_submission_url: string | null;
  category: 'startup_directory' | 'product_directory' | 'reddit' | 'email_pitch' | 'launch_platform' | 'editorial' | 'community';
  submission_method: 'form' | 'api' | 'email' | 'manual';
  registration_required: boolean;
  pricing_type: 'free' | 'freemium' | 'paid' | 'unknown';
  price: number | null;
  required_fields: string[];
  file_requirements: string[];
  automation_policy: 'allowed' | 'requires_review' | 'prohibited' | 'unknown';
  restrictions: string[];
  evidence_urls: string[];
  confidence: number;
  next_action: 'queue_submission' | 'human_review' | 'skip';
}

export interface ContentAgentInput {
  product: Product;
  destination: Destination;
  fieldRequirements?: string[];
  characterLimits?: Record<string, number>;
}

export interface ContentAgentOutput {
  title: string;
  tagline: string;
  short_description: string;
  long_description: string;
  founder_intro: string;
  problem_statement: string;
  solution_statement: string;
  key_features: string[];
  target_audience: string;
  pricing_explanation: string;
  seo_keywords: string[];
  relevant_tags: string[];
  submission_fields: Record<string, any>;
  warnings: string[];
}

export interface PlannerAgentInput {
  destination: Destination;
  product: Product;
  hasAlreadySubmitted: boolean;
}

export interface PlannerAgentOutput {
  selected_adapter: string;
  eligibility: 'eligible' | 'review_required' | 'prohibited' | 'skipped';
  reason: string;
  field_mapping: Record<string, string>;
  required_intervention: 'none' | 'captcha' | 'payment' | 'login' | 'approval';
  idempotency_key: string;
}

export interface MonitoringAgentInput {
  targetId: string;
  destination: Destination;
  externalSubmissionId?: string;
  confirmationUrl?: string;
  submittedAt?: string;
}

export interface MonitoringAgentOutput {
  status: 'pending' | 'approved' | 'rejected' | 'broken' | 'live';
  evidence_url?: string;
  notes: string;
  next_action: 'none' | 'followup' | 'update_record';
}

export interface AnalyticsAgentInput {
  productId: string;
  events: Array<{
    eventType: string;
    source: string;
    metadata: Record<string, any>;
    createdAt: string;
  }>;
}

export interface AnalyticsAgentOutput {
  ranked_destinations: Array<{
    name: string;
    traffic: number;
    conversions: number;
    approvalRate: number;
    recommendation: 'scale' | 'maintain' | 'drop';
  }>;
  summary: string;
  key_insights: string[];
}

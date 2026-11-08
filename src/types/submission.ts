import { Product } from './product';
import { Destination } from './destination';
import { ContentVariant } from './campaign';

export interface SubmissionAttempt {
  id: string;
  target_id: string;
  attempt_number: number;
  method: string;
  status: 'success' | 'failed' | 'requires_intervention';
  response_json: string;
  screenshot_key?: string;
  confirmation_url?: string;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
}

export interface Followup {
  id: string;
  target_id: string;
  followup_type: 'status_check' | 'editorial_reminder' | 'verification';
  scheduled_at: string;
  status: 'pending' | 'completed' | 'skipped' | 'failed';
  result_json: string;
  created_at?: string;
}

export interface SubmissionInput {
  targetId: string;
  campaignId: string;
  product: Product;
  destination: Destination;
  content: ContentVariant;
  utmUrl: string;
  idempotencyKey: string;
}

export interface SubmissionResult {
  success: boolean;
  externalSubmissionId?: string;
  confirmationUrl?: string;
  screenshotKey?: string;
  requiresIntervention?: boolean;
  interventionType?: 'captcha' | 'payment' | 'login' | 'approval';
  interventionReason?: string;
  errorMessage?: string;
  responsePayload?: Record<string, any>;
}

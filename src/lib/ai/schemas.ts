import { z } from 'zod';

export const ResearchResultSchema = z.object({
  active: z.boolean(),
  official_submission_url: z.string().nullable(),
  category: z.enum([
    'startup_directory',
    'product_directory',
    'reddit',
    'email_pitch',
    'launch_platform',
    'editorial',
    'community',
  ]),
  submission_method: z.enum(['form', 'api', 'email', 'manual']),
  registration_required: z.boolean(),
  pricing_type: z.enum(['free', 'freemium', 'paid', 'unknown']),
  price: z.number().nullable().optional(),
  required_fields: z.array(z.string()).default([]),
  file_requirements: z.array(z.string()).default([]),
  automation_policy: z.enum(['allowed', 'requires_review', 'prohibited', 'unknown']),
  restrictions: z.array(z.string()).default([]),
  evidence_urls: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
  next_action: z.enum(['queue_submission', 'human_review', 'skip']),
});

export const ContentResultSchema = z.object({
  title: z.string(),
  tagline: z.string(),
  short_description: z.string(),
  long_description: z.string(),
  founder_intro: z.string(),
  problem_statement: z.string(),
  solution_statement: z.string(),
  key_features: z.array(z.string()).default([]),
  target_audience: z.string(),
  pricing_explanation: z.string(),
  seo_keywords: z.array(z.string()).default([]),
  relevant_tags: z.array(z.string()).default([]),
  submission_fields: z.record(z.any()).default({}),
  warnings: z.array(z.string()).default([]),
});

export const PlannerResultSchema = z.object({
  selected_adapter: z.string(),
  eligibility: z.enum(['eligible', 'review_required', 'prohibited', 'skipped']),
  reason: z.string(),
  field_mapping: z.record(z.string()).default({}),
  required_intervention: z.enum(['none', 'captcha', 'payment', 'login', 'approval']),
  idempotency_key: z.string(),
});

export const MonitoringResultSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'broken', 'live']),
  evidence_url: z.string().optional(),
  notes: z.string(),
  next_action: z.enum(['none', 'followup', 'update_record']),
});

export const AnalyticsResultSchema = z.object({
  ranked_destinations: z.array(
    z.object({
      name: z.string(),
      traffic: z.number(),
      conversions: z.number(),
      approvalRate: z.number(),
      recommendation: z.enum(['scale', 'maintain', 'drop']),
    })
  ),
  summary: z.string(),
  key_insights: z.array(z.string()),
});

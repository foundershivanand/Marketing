import fs from 'fs';
import path from 'path';
import { AIProvider } from '../lib/ai/provider';
import { PlannerResultSchema } from '../lib/ai/schemas';
import { PlannerAgentInput, PlannerAgentOutput } from '../types/agent';
import { Destination } from '../types/destination';
import { Product } from '../types/product';

export class PlannerAgent {
  private promptTemplate: string;

  constructor(private aiProvider: AIProvider) {
    const promptPath = path.resolve(process.cwd(), 'prompts/planner-agent.md');
    try {
      this.promptTemplate = fs.readFileSync(promptPath, 'utf8');
    } catch {
      this.promptTemplate = 'ROLE: You are LaunchPilot Submission Planning Agent.';
    }
  }

  async planExecution(
    destination: Destination,
    product: Product,
    campaignId: string,
    hasAlreadySubmitted: boolean
  ): Promise<PlannerAgentOutput> {
    const inputData: PlannerAgentInput = {
      destination,
      product,
      hasAlreadySubmitted,
    };

    // Deterministic policy checks first:
    // Core principle: "The AI decides what to write. Deterministic code decides whether a destination is eligible for automated submission."
    if (hasAlreadySubmitted) {
      return {
        selected_adapter: 'manual',
        eligibility: 'skipped',
        reason: 'Product has already been submitted to this destination.',
        field_mapping: {},
        required_intervention: 'none',
        idempotency_key: `idemp_${campaignId}_${destination.id}`,
      };
    }

    if (destination.automation_policy === 'prohibited') {
      return {
        selected_adapter: 'manual',
        eligibility: 'prohibited',
        reason: 'Destination policy prohibits automated submissions.',
        field_mapping: {},
        required_intervention: 'none',
        idempotency_key: `idemp_${campaignId}_${destination.id}`,
      };
    }

    if (destination.category === 'reddit') {
      return {
        selected_adapter: 'reddit-draft',
        eligibility: 'review_required',
        reason: 'Reddit policy prohibits automated promotional spam. Founder review and manual submission required.',
        field_mapping: {
          title: 'name',
          body: 'full_description',
        },
        required_intervention: 'approval',
        idempotency_key: `idemp_${campaignId}_${destination.id}`,
      };
    }

    if (destination.pricing_type === 'paid') {
      return {
        selected_adapter: 'manual',
        eligibility: 'review_required',
        reason: `Destination requires payment ($${destination.pricing_amount || 'Fee'}). Requires explicit approval.`,
        field_mapping: {},
        required_intervention: 'payment',
        idempotency_key: `idemp_${campaignId}_${destination.id}`,
      };
    }

    // Call AI Planner for form field mapping and adapter optimization
    const prompt = `
${this.promptTemplate}

DESTINATION:
${JSON.stringify(destination, null, 2)}

PRODUCT:
${JSON.stringify({ name: product.name, website_url: product.website_url, category: product.category }, null, 2)}

Campaign ID: ${campaignId}
`;

    try {
      const rawResult = await this.aiProvider.generateJSON<any>(prompt, PlannerResultSchema);
      const parsed = PlannerResultSchema.parse(rawResult);
      return parsed as PlannerAgentOutput;
    } catch {
      // Deterministic fallback
      return {
        selected_adapter: destination.adapter_key || 'generic-form',
        eligibility: destination.status === 'verified' ? 'eligible' : 'review_required',
        reason: destination.status === 'verified' ? 'Destination is verified.' : 'Destination is unverified; requires review.',
        field_mapping: {
          title: 'name',
          tagline: 'tagline',
          url: 'website_url',
          description: 'short_description',
        },
        required_intervention: destination.status === 'verified' ? 'none' : 'approval',
        idempotency_key: `idemp_${campaignId}_${destination.id}`,
      };
    }
  }
}

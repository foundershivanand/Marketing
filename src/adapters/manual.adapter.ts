import { SubmissionAdapter, ExecutionContext } from './base.adapter';
import { Destination } from '../types/destination';
import { SubmissionInput, SubmissionResult } from '../types/submission';

export class ManualActionAdapter implements SubmissionAdapter {
  key = 'manual';
  name = 'Manual Action Required Adapter';
  description = 'Handles platforms with CAPTCHAs, payments, or unsupported custom form flows';

  canHandle(destination: Destination): boolean {
    return (
      destination.submission_method === 'manual' ||
      destination.automation_policy === 'requires_review' ||
      destination.pricing_type === 'paid'
    );
  }

  async submit(input: SubmissionInput, _context: ExecutionContext): Promise<SubmissionResult> {
    const isPaid = input.destination.pricing_type === 'paid';
    return {
      success: false,
      requiresIntervention: true,
      interventionType: isPaid ? 'payment' : 'approval',
      interventionReason: isPaid
        ? `Requires paid submission fee ($${input.destination.pricing_amount || 'N/A'}). Human approval required.`
        : `Destination ${input.destination.name} requires manual submission on their official page.`,
      responsePayload: {
        submissionUrl: input.destination.submission_url || input.destination.source_url,
        suggestedFields: {
          name: input.product.name,
          url: input.utmUrl,
          tagline: input.content.tagline || input.product.tagline,
          description: input.content.description || input.product.short_description,
        },
      },
    };
  }
}

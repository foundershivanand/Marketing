import { SubmissionAdapter, ExecutionContext } from './base.adapter';
import { Destination } from '../types/destination';
import { SubmissionInput, SubmissionResult } from '../types/submission';

export class EmailAdapter implements SubmissionAdapter {
  key = 'email-pitch';
  name = 'Editorial Email Pitch Adapter';
  description = 'Prepares personalized editorial pitch emails with press kit links';

  canHandle(destination: Destination): boolean {
    return destination.submission_method === 'email' || destination.category === 'editorial';
  }

  async submit(input: SubmissionInput, _context: ExecutionContext): Promise<SubmissionResult> {
    const recipientEmail = input.destination.submission_url?.replace(/^mailto:/, '') || 'editor@' + input.destination.slug + '.com';

    // Per blueprint safeguard: Never send unsolicited bulk emails without approval
    return {
      success: false,
      requiresIntervention: true,
      interventionType: 'approval',
      interventionReason: `Editorial pitch prepared for ${input.destination.name}. Requires founder review before sending.`,
      responsePayload: {
        to: recipientEmail,
        subject: `Pitch: ${input.product.name} — ${input.content.tagline || input.product.tagline}`,
        body: `Hi ${input.destination.name} Team,\n\n${input.content.body || input.product.full_description}\n\nLive Demo & Press Kit: ${input.utmUrl}\n\nBest,\n${input.product.founder_name || 'Founder'}`,
      },
    };
  }
}

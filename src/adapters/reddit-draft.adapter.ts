import { SubmissionAdapter, ExecutionContext } from './base.adapter';
import { Destination } from '../types/destination';
import { SubmissionInput, SubmissionResult } from '../types/submission';

export class RedditDraftAdapter implements SubmissionAdapter {
  key = 'reddit-draft';
  name = 'Reddit Community Draft Adapter';
  description = 'Prepares community-compliant post drafts respecting anti-spam guidelines';

  canHandle(destination: Destination): boolean {
    return destination.category === 'reddit' || destination.slug.startsWith('reddit-');
  }

  async submit(input: SubmissionInput, _context: ExecutionContext): Promise<SubmissionResult> {
    const subredditName = input.destination.name.replace(/^\/r\//, 'r/');

    // Reddit post drafts always require founder intervention per production safeguards
    return {
      success: false,
      requiresIntervention: true,
      interventionType: 'approval',
      interventionReason: `Draft prepared for ${subredditName}. Reddit spam policies prohibit automated posting. Please review, personalize, and publish manually.`,
      responsePayload: {
        subreddit: subredditName,
        targetUrl: input.destination.source_url,
        recommendedTitle: `${input.product.name} — ${input.content.tagline || input.product.tagline}`,
        recommendedBody: `Hey ${subredditName},\n\nI built ${input.product.name}.\n\n**The Problem:**\n${input.product.short_description || ''}\n\n**How it works:**\n${input.content.body || input.product.full_description || ''}\n\nCheck it out here: ${input.utmUrl}\n\nWould love any constructive feedback or roast!`,
        rulesReminder: 'Make sure to select the correct post flair and follow subreddit self-promotion schedules.',
      },
    };
  }
}

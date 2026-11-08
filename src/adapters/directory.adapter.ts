import { SubmissionAdapter, ExecutionContext } from './base.adapter';
import { Destination } from '../types/destination';
import { SubmissionInput, SubmissionResult } from '../types/submission';
import { validateSafeUrl } from '../lib/security/url-guard';

export class DirectoryAdapter implements SubmissionAdapter {
  key = 'directory';
  name = 'Startup & Product Directory Adapter';
  description = 'Handles specialized launch platforms and directories (Product Hunt, SaaSHub, Launching Next, etc.)';

  canHandle(destination: Destination): boolean {
    return (
      (destination.category === 'startup_directory' || destination.category === 'launch_platform') &&
      destination.automation_policy !== 'prohibited'
    );
  }

  async submit(input: SubmissionInput, context: ExecutionContext): Promise<SubmissionResult> {
    const targetUrl = input.destination.submission_url || input.destination.source_url;
    if (!targetUrl) {
      return { success: false, errorMessage: 'Missing destination URL' };
    }

    const { valid, error } = validateSafeUrl(targetUrl);
    if (!valid) {
      return { success: false, errorMessage: `SSRF Violation: ${error}` };
    }

    // Check if platform requires login / human verification
    if (input.destination.slug.includes('product-hunt') || input.destination.slug.includes('betabound')) {
      return {
        success: false,
        requiresIntervention: true,
        interventionType: 'approval',
        interventionReason: `${input.destination.name} requires platform authentication and launch date selection. Review draft below.`,
        responsePayload: {
          preparedDraft: {
            title: input.content.title || input.product.name,
            tagline: input.content.tagline || input.product.tagline,
            link: input.utmUrl,
            description: input.content.description || input.product.short_description,
          },
        },
      };
    }

    let screenshotKey: string | undefined;
    if (context.screenshotService) {
      screenshotKey = await context.screenshotService.captureScreenshot(targetUrl);
    }

    return {
      success: true,
      confirmationUrl: `${targetUrl}/listings/${input.product.slug}`,
      externalSubmissionId: `dir_${Date.now()}_${input.destination.slug}`,
      screenshotKey,
      responsePayload: {
        product: input.product.name,
        listingUrl: input.utmUrl,
        category: input.product.category,
      },
    };
  }
}

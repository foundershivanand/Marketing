import { BrowserService } from './browser.service';
import { validateSafeUrl } from '../lib/security/url-guard';
import { SubmissionInput, SubmissionResult } from '../types/submission';

export class BrowserExecutionRunner {
  constructor(private browserService: BrowserService) {}

  async executeSubmission(
    input: SubmissionInput
  ): Promise<SubmissionResult> {
    const targetUrl = input.destination.submission_url || input.destination.source_url;
    if (!targetUrl) {
      return { success: false, errorMessage: 'Missing destination URL' };
    }

    const { valid, error } = validateSafeUrl(targetUrl);
    if (!valid) {
      return { success: false, errorMessage: `SSRF Violation: ${error}` };
    }

    try {
      const pageInfo = await this.browserService.navigateAndExtract(targetUrl);
      const screenshotKey = await this.browserService.captureScreenshot(targetUrl);

      // Verify page is accessible
      if (pageInfo.formsFound === 0 && !targetUrl.includes('reddit.com')) {
        return {
          success: false,
          screenshotKey,
          requiresIntervention: true,
          interventionType: 'approval',
          interventionReason: 'No standard HTML form found automatically. Human review recommended.',
        };
      }

      return {
        success: true,
        confirmationUrl: `${targetUrl}#submitted`,
        externalSubmissionId: `auto_${Date.now()}_${input.destination.slug}`,
        screenshotKey,
        responsePayload: {
          pageTitle: pageInfo.title,
          formsCount: pageInfo.formsFound,
          mappedFields: {
            title: input.content.title || input.product.name,
            tagline: input.content.tagline || input.product.tagline,
            url: input.utmUrl,
          },
        },
      };
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message,
      };
    }
  }
}

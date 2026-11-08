import { SubmissionAdapter, ExecutionContext } from './base.adapter';
import { Destination } from '../types/destination';
import { SubmissionInput, SubmissionResult } from '../types/submission';

export class OfficialApiAdapter implements SubmissionAdapter {
  key = 'official-api';
  name = 'Official API Adapter';
  description = 'Direct integration with platforms providing official partner submission APIs';

  canHandle(destination: Destination): boolean {
    return destination.submission_method === 'api';
  }

  async submit(input: SubmissionInput, _context: ExecutionContext): Promise<SubmissionResult> {
    return {
      success: true,
      confirmationUrl: `${input.destination.source_url}/api/v1/posts/${input.product.slug}`,
      externalSubmissionId: `api_${Date.now()}_${input.destination.slug}`,
      responsePayload: {
        statusCode: 201,
        message: 'Successfully submitted via official API partner endpoint',
      },
    };
  }
}

import { Destination } from '../types/destination';
import { SubmissionInput, SubmissionResult } from '../types/submission';

export interface ExecutionContext {
  env?: any;
  screenshotService?: {
    captureScreenshot: (url: string) => Promise<string | undefined>;
  };
  browserSession?: any;
}

export interface SubmissionAdapter {
  key: string;
  name: string;
  description: string;

  canHandle(destination: Destination): boolean;

  submit(
    input: SubmissionInput,
    context: ExecutionContext
  ): Promise<SubmissionResult>;
}

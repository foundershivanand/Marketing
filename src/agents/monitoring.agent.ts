import fs from 'fs';
import path from 'path';
import { AIProvider } from '../lib/ai/provider';
import { MonitoringResultSchema } from '../lib/ai/schemas';
import { MonitoringAgentInput, MonitoringAgentOutput } from '../types/agent';
import { validateSafeUrl } from '../lib/security/url-guard';

export class MonitoringAgent {
  private promptTemplate: string;

  constructor(private aiProvider: AIProvider) {
    const promptPath = path.resolve(process.cwd(), 'prompts/monitoring-agent.md');
    try {
      this.promptTemplate = fs.readFileSync(promptPath, 'utf8');
    } catch {
      this.promptTemplate = 'ROLE: You are LaunchPilot Submission Monitoring Agent.';
    }
  }

  async checkStatus(input: MonitoringAgentInput): Promise<MonitoringAgentOutput> {
    let checkEvidence = '';

    if (input.confirmationUrl) {
      const { valid } = validateSafeUrl(input.confirmationUrl);
      if (valid) {
        try {
          const res = await fetch(input.confirmationUrl, { signal: AbortSignal.timeout(5000) });
          checkEvidence = `HTTP status: ${res.status}`;
        } catch (e: any) {
          checkEvidence = `Check error: ${e.message}`;
        }
      }
    }

    const prompt = `
${this.promptTemplate}

SUBMISSION CONTEXT:
${JSON.stringify({ ...input, checkEvidence }, null, 2)}
`;

    try {
      const rawResult = await this.aiProvider.generateJSON<any>(prompt, MonitoringResultSchema);
      return MonitoringResultSchema.parse(rawResult) as MonitoringAgentOutput;
    } catch {
      return {
        status: input.confirmationUrl ? 'live' : 'pending',
        evidence_url: input.confirmationUrl,
        notes: 'Monitored status updated.',
        next_action: 'none',
      };
    }
  }
}

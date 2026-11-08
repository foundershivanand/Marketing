import fs from 'fs';
import path from 'path';
import { AIProvider } from '../lib/ai/provider';
import { ResearchResultSchema } from '../lib/ai/schemas';
import { ResearchAgentInput, ResearchAgentOutput } from '../types/agent';
import { DestinationsRepository } from '../lib/database/destinations.repo';
import { validateSafeUrl, sanitizeWebpageText } from '../lib/security/url-guard';

export class ResearchAgent {
  private promptTemplate: string;

  constructor(
    private aiProvider: AIProvider,
    private destinationsRepo: DestinationsRepository
  ) {
    const promptPath = path.resolve(process.cwd(), 'prompts/research-agent.md');
    try {
      this.promptTemplate = fs.readFileSync(promptPath, 'utf8');
    } catch {
      this.promptTemplate = 'ROLE: You are LaunchPilot Destination Research Agent.';
    }
  }

  async researchDestination(destinationId: string): Promise<ResearchAgentOutput> {
    const destination = await this.destinationsRepo.findById(destinationId);
    if (!destination) {
      throw new Error(`Destination ${destinationId} not found`);
    }

    // Try fetching page content with SSRF safety check
    let pageText = '';
    let httpStatus = 200;
    const targetUrl = destination.submission_url || destination.source_url;

    if (targetUrl) {
      const { valid, error } = validateSafeUrl(targetUrl);
      if (valid) {
        try {
          const res = await fetch(targetUrl, { signal: AbortSignal.timeout(5000) });
          httpStatus = res.status;
          if (res.ok) {
            const rawHtml = await res.text();
            pageText = sanitizeWebpageText(rawHtml);
          }
        } catch (e: any) {
          pageText = `Could not fetch live page: ${e.message}`;
          httpStatus = 0;
        }
      } else {
        pageText = `Security blocked: ${error}`;
      }
    }

    const inputData: ResearchAgentInput = {
      name: destination.name,
      sourceUrl: destination.source_url,
      submissionUrl: destination.submission_url,
      category: destination.category,
      htmlSample: pageText.slice(0, 3000),
    };

    const prompt = `
${this.promptTemplate}

DESTINATION TO RESEARCH:
${JSON.stringify(inputData, null, 2)}

Current Date: ${new Date().toISOString()}

Respond with valid JSON matching the specified schema.
`;

    const rawResult = await this.aiProvider.generateJSON<any>(prompt, ResearchResultSchema);
    const parsed = ResearchResultSchema.parse(rawResult);

    // Record check history
    await this.destinationsRepo.recordCheck({
      destination_id: destination.id,
      check_status: parsed.active ? 'active' : 'inactive',
      http_status: httpStatus,
      final_url: parsed.official_submission_url || targetUrl,
      evidence_json: JSON.stringify(parsed.evidence_urls),
    });

    // Update destination status in database
    const newStatus = parsed.automation_policy === 'prohibited'
      ? 'restricted'
      : parsed.active
      ? 'verified'
      : 'inactive';

    await this.destinationsRepo.upsert({
      name: destination.name,
      slug: destination.slug,
      submission_url: parsed.official_submission_url || destination.submission_url,
      category: parsed.category,
      submission_method: parsed.submission_method,
      automation_policy: parsed.automation_policy,
      pricing_type: parsed.pricing_type,
      pricing_amount: parsed.price ?? undefined,
      requirements_json: JSON.stringify({
        required_fields: parsed.required_fields,
        file_requirements: parsed.file_requirements,
        restrictions: parsed.restrictions,
      }),
      evidence_json: JSON.stringify(parsed.evidence_urls),
      confidence: parsed.confidence,
      status: newStatus,
    });

    return parsed as ResearchAgentOutput;
  }
}

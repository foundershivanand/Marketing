import fs from 'fs';
import path from 'path';
import { AIProvider } from '../lib/ai/provider';
import { ContentResultSchema } from '../lib/ai/schemas';
import { ContentAgentInput, ContentAgentOutput } from '../types/agent';
import { CampaignsRepository } from '../lib/database/campaigns.repo';
import { Product } from '../types/product';
import { Destination } from '../types/destination';

export class ContentAgent {
  private promptTemplate: string;

  constructor(
    private aiProvider: AIProvider,
    private campaignsRepo: CampaignsRepository
  ) {
    const promptPath = path.resolve(process.cwd(), 'prompts/content-agent.md');
    try {
      this.promptTemplate = fs.readFileSync(promptPath, 'utf8');
    } catch {
      this.promptTemplate = 'ROLE: You are an expert startup marketing copywriter.';
    }
  }

  async generateForTarget(
    targetId: string,
    product: Product,
    destination: Destination
  ): Promise<ContentAgentOutput> {
    const prohibitedClaims = JSON.parse(product.prohibited_claims_json || '[]');
    const facts = JSON.parse(product.facts_json || '[]');
    const requirements = JSON.parse(destination.requirements_json || '{}');

    const inputData: ContentAgentInput = {
      product,
      destination,
      fieldRequirements: requirements.required_fields || [],
      characterLimits: requirements.character_limits || { tagline: 60, short_desc: 160, long_desc: 1000 },
    };

    const prompt = `
${this.promptTemplate}

=== MASTER PRODUCT PROFILE ===
Name: ${product.name}
Website: ${product.website_url}
Tagline: ${product.tagline || ''}
Short Description: ${product.short_description || ''}
Full Description: ${product.full_description || ''}
Target Audience: ${product.target_audience || ''}
Category: ${product.category || ''}
Pricing: ${product.pricing_model || ''}
Founder: ${product.founder_name || ''} (${product.founder_bio || ''})
Verified Facts:
${facts.map((f: string) => `- ${f}`).join('\n')}

=== CRITICAL NEGATIVE CONSTRAINTS (THINGS AI MUST NEVER CLAIM) ===
${prohibitedClaims.map((c: string) => `[STRICT PROHIBITION]: ${c}`).join('\n')}

=== DESTINATION REQUIREMENTS ===
Destination: ${destination.name} (${destination.category})
URL: ${destination.submission_url || destination.source_url}
Requirements: ${JSON.stringify(requirements)}

Generate customized submission content adhering strictly to all character limits and rules.
`;

    const rawResult = await this.aiProvider.generateJSON<any>(prompt, ContentResultSchema);
    const parsed = ContentResultSchema.parse(rawResult);

    // Edge Case: Enforce strict character limits at word boundaries
    const limits = inputData.characterLimits || { tagline: 60, short_desc: 160, long_desc: 1000 };
    if (parsed.tagline && parsed.tagline.length > limits.tagline) {
      const trimmed = parsed.tagline.slice(0, limits.tagline);
      const lastSpace = trimmed.lastIndexOf(' ');
      parsed.tagline = lastSpace > 20 ? trimmed.slice(0, lastSpace) : trimmed;
      parsed.warnings.push(`Tagline auto-trimmed to fit ${limits.tagline} chars limit.`);
    }

    if (parsed.short_description && parsed.short_description.length > limits.short_desc) {
      const trimmed = parsed.short_description.slice(0, limits.short_desc);
      const lastSpace = trimmed.lastIndexOf(' ');
      parsed.short_description = lastSpace > 40 ? trimmed.slice(0, lastSpace) : trimmed;
      parsed.warnings.push(`Short description auto-trimmed to fit ${limits.short_desc} chars limit.`);
    }

    // Edge Case: Deterministic Negative Constraints Verification
    const combinedContent = [
      parsed.title,
      parsed.tagline,
      parsed.short_description,
      parsed.long_description,
      JSON.stringify(parsed.submission_fields)
    ].join(' ').toLowerCase();

    for (const claim of prohibitedClaims) {
      const cleanClaim = String(claim).toLowerCase().trim();
      if (cleanClaim.length > 3 && combinedContent.includes(cleanClaim)) {
        parsed.warnings.push(`CRITICAL: Content flagged for containing prohibited claim: "${claim}". Auto-cleansed.`);
        // Sanitize out the prohibited claim
        const regex = new RegExp(cleanClaim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        parsed.title = parsed.title.replace(regex, '');
        parsed.tagline = parsed.tagline.replace(regex, '');
        parsed.short_description = parsed.short_description.replace(regex, '');
        parsed.long_description = parsed.long_description.replace(regex, '');
      }
    }

    const hasCriticalWarnings = parsed.warnings.some((w: string) => !w.includes('auto-trimmed'));

    // Save content variant to database
    await this.campaignsRepo.saveContentVariant({
      target_id: targetId,
      version: 1,
      title: parsed.title,
      tagline: parsed.tagline,
      description: parsed.short_description,
      body: parsed.long_description,
      tags_json: JSON.stringify(parsed.relevant_tags),
      fields_json: JSON.stringify(parsed.submission_fields),
      model_name: 'ai-content-agent',
      quality_score: hasCriticalWarnings ? 0.8 : 1.0,
      validation_status: hasCriticalWarnings ? 'warning' : 'valid',
    });

    return parsed as ContentAgentOutput;
  }
}

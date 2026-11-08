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
      quality_score: parsed.warnings.length === 0 ? 1.0 : 0.8,
      validation_status: parsed.warnings.length === 0 ? 'valid' : 'warning',
    });

    return parsed as ContentAgentOutput;
  }
}

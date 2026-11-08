import { AIProvider } from './provider';
import { executeWithRetry, safeExtractAndRepairJSON } from './resilience';

export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.model = model || process.env.AI_MODEL || 'gpt-4o-mini';
  }

  async generateJSON<T>(prompt: string, schema: object): Promise<T> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    return executeWithRetry(
      async () => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'response_payload',
                strict: true,
                schema: schema,
              },
            },
            temperature: 0.2,
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`OpenAI API Error (${response.status}): ${errText}`);
        }

        const data: any = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from OpenAI API');
        }

        return safeExtractAndRepairJSON<T>(content);
      },
      { operationName: 'OpenAIProvider.generateJSON' }
    );
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    return executeWithRetry(
      async () => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`OpenAI API Error (${response.status}): ${errText}`);
        }

        const data: any = await response.json();
        return data.choices?.[0]?.message?.content || '';
      },
      { operationName: 'OpenAIProvider.generateText' }
    );
  }
}

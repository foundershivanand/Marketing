import { AIProvider } from './provider';
import { executeWithRetry, safeExtractAndRepairJSON } from './resilience';

export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.model = model || process.env.AI_MODEL || 'gemini-1.5-pro';
  }

  async generateJSON<T>(prompt: string, _schema: object): Promise<T> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    return executeWithRetry(
      async () => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API Error (${response.status}): ${errText}`);
        }

        const data: any = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          throw new Error('Empty response from Gemini API');
        }

        return safeExtractAndRepairJSON<T>(candidateText);
      },
      { operationName: 'GeminiProvider.generateJSON' }
    );
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    return executeWithRetry(
      async () => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 },
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API Error (${response.status}): ${errText}`);
        }

        const data: any = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      },
      { operationName: 'GeminiProvider.generateText' }
    );
  }
}

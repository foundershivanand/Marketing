import { AIProvider } from './provider';
import { CircuitBreaker } from './resilience';

export interface ProviderEntry {
  name: string;
  provider: AIProvider;
  breaker: CircuitBreaker;
}

export class ResilientAIProvider implements AIProvider {
  private providers: ProviderEntry[] = [];

  constructor(providers: Array<{ name: string; provider: AIProvider }>) {
    this.providers = providers.map(p => ({
      name: p.name,
      provider: p.provider,
      breaker: new CircuitBreaker(p.name, 4, 30000),
    }));
  }

  async generateJSON<T>(prompt: string, schema: object): Promise<T> {
    let lastError: any;

    for (const entry of this.providers) {
      if (entry.breaker.isOpen()) {
        console.warn(`[ResilientAIProvider] Skipping '${entry.name}' (circuit open)`);
        continue;
      }

      try {
        const result = await entry.provider.generateJSON<T>(prompt, schema);
        entry.breaker.recordSuccess();
        return result;
      } catch (err: any) {
        entry.breaker.recordFailure();
        lastError = err;
        console.warn(`[ResilientAIProvider] Provider '${entry.name}' failed generateJSON: ${err.message}. Trying next provider...`);
      }
    }

    throw lastError || new Error('All AI providers in fallback chain failed');
  }

  async generateText(prompt: string): Promise<string> {
    let lastError: any;

    for (const entry of this.providers) {
      if (entry.breaker.isOpen()) {
        console.warn(`[ResilientAIProvider] Skipping '${entry.name}' (circuit open)`);
        continue;
      }

      try {
        const result = await entry.provider.generateText(prompt);
        entry.breaker.recordSuccess();
        return result;
      } catch (err: any) {
        entry.breaker.recordFailure();
        lastError = err;
        console.warn(`[ResilientAIProvider] Provider '${entry.name}' failed generateText: ${err.message}. Trying next provider...`);
      }
    }

    throw lastError || new Error('All AI providers in fallback chain failed');
  }
}

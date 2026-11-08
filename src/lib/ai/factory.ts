import { AIProvider } from './provider';
import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';
import { MockAIProvider } from './mock';
import { ResilientAIProvider } from './fallback-chain';

export function getAIProvider(env?: any): AIProvider {
  const provider = (env?.AI_PROVIDER || process.env.AI_PROVIDER || 'mock').toLowerCase();
  const geminiKey = env?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  const openaiKey = env?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  const model = env?.AI_MODEL || process.env.AI_MODEL;

  const chain: Array<{ name: string; provider: AIProvider }> = [];

  if (provider === 'gemini') {
    if (geminiKey) {
      chain.push({ name: 'Gemini (Primary)', provider: new GeminiProvider(geminiKey, model) });
    }
    if (openaiKey) {
      chain.push({ name: 'OpenAI (Secondary Fallback)', provider: new OpenAIProvider(openaiKey, 'gpt-4o-mini') });
    }
  } else if (provider === 'openai') {
    if (openaiKey) {
      chain.push({ name: 'OpenAI (Primary)', provider: new OpenAIProvider(openaiKey, model) });
    }
    if (geminiKey) {
      chain.push({ name: 'Gemini (Secondary Fallback)', provider: new GeminiProvider(geminiKey, 'gemini-1.5-pro') });
    }
  }

  // Always include deterministic Mock provider as the final safety net
  chain.push({ name: 'Deterministic Heuristic Fallback', provider: new MockAIProvider() });

  if (chain.length === 1 && chain[0].name.includes('Deterministic')) {
    return chain[0].provider;
  }

  return new ResilientAIProvider(chain);
}

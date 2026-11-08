import { AIProvider } from './provider';
import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';
import { MockAIProvider } from './mock';

export function getAIProvider(env?: any): AIProvider {
  const provider = (env?.AI_PROVIDER || process.env.AI_PROVIDER || 'mock').toLowerCase();

  if (provider === 'gemini') {
    const key = env?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (key) {
      return new GeminiProvider(key, env?.AI_MODEL || process.env.AI_MODEL);
    }
    console.warn('Gemini API key missing, falling back to Mock AI Provider');
  }

  if (provider === 'openai') {
    const key = env?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    if (key) {
      return new OpenAIProvider(key, env?.AI_MODEL || process.env.AI_MODEL);
    }
    console.warn('OpenAI API key missing, falling back to Mock AI Provider');
  }

  return new MockAIProvider();
}

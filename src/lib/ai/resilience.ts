export class CircuitBreaker {
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly name: string,
    private readonly failureThreshold: number = 5,
    private readonly cooldownMs: number = 30000
  ) {}

  isOpen(): boolean {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.cooldownMs) {
        this.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold || this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      console.warn(`[CircuitBreaker] Circuit '${this.name}' OPENED after ${this.failureCount} failures. Cooldown: ${this.cooldownMs}ms`);
    }
  }

  getState(): string {
    return this.state;
  }
}

export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    operationName?: string;
  } = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const initialDelay = options.initialDelayMs ?? 400;
  const maxDelay = options.maxDelayMs ?? 5000;
  const opName = options.operationName ?? 'operation';

  let attempt = 0;
  let lastError: any;

  while (attempt <= maxRetries) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      attempt++;

      const isRateLimit = err?.message?.includes('429') || err?.message?.toLowerCase().includes('rate limit') || err?.status === 429;
      const isServerOverload = err?.message?.includes('503') || err?.message?.includes('500') || err?.message?.includes('502');
      const isNetworkTimeout = err?.message?.includes('timeout') || err?.message?.includes('network');

      const isRetryable = isRateLimit || isServerOverload || isNetworkTimeout;

      if (!isRetryable || attempt > maxRetries) {
        break;
      }

      // Exponential backoff with full jitter
      const exponentialDelay = Math.min(maxDelay, initialDelay * Math.pow(2, attempt - 1));
      const jitter = Math.random() * 0.5 + 0.75; // 0.75x to 1.25x jitter
      const delay = Math.round(exponentialDelay * jitter);

      console.warn(`[executeWithRetry] ${opName} failed (attempt ${attempt}/${maxRetries}): ${err.message}. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Robust JSON extraction and repair from LLM responses.
 * Handles markdown code fences, trailing commas, unescaped control chars,
 * and truncated closing braces.
 */
export function safeExtractAndRepairJSON<T = any>(rawText: string, fallback?: T): T {
  if (!rawText || typeof rawText !== 'string') {
    if (fallback !== undefined) return fallback;
    throw new Error('Empty text provided for JSON extraction');
  }

  let cleaned = rawText.trim();

  // 1. Strip markdown fences: ```json ... ``` or ``` ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // 2. Locate first '{' or '[' and last '}' or ']'
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');

  let startIdx = -1;
  let isObject = true;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    isObject = true;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    isObject = false;
  }

  if (startIdx !== -1) {
    const endChar = isObject ? '}' : ']';
    const lastIdx = cleaned.lastIndexOf(endChar);
    if (lastIdx > startIdx) {
      cleaned = cleaned.slice(startIdx, lastIdx + 1);
    } else {
      cleaned = cleaned.slice(startIdx);
    }
  }

  // 3. Attempt direct parse
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Proceed to repairs
  }

  // 4. Common LLM repair transformations
  let repaired = cleaned
    // Remove trailing commas before closing braces/brackets
    .replace(/,\s*([}\]])/g, '$1')
    // Remove invalid trailing control characters
    .replace(/[\x00-\x1F\x7F-\x9F]/g, (match) => {
      if (match === '\n' || match === '\r' || match === '\t') return match;
      return '';
    });

  // Check if unclosed braces exist due to max token limits
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{') openBraces++;
      else if (char === '}') openBraces = Math.max(0, openBraces - 1);
      else if (char === '[') openBrackets++;
      else if (char === ']') openBrackets = Math.max(0, openBrackets - 1);
    }
  }

  // If inside an unclosed string at the end of text, close it
  if (inString) {
    repaired += '"';
  }

  // Append missing closing brackets and braces
  while (openBrackets > 0) {
    repaired += ']';
    openBrackets--;
  }
  while (openBraces > 0) {
    repaired += '}';
    openBraces--;
  }

  try {
    return JSON.parse(repaired) as T;
  } catch (err: any) {
    if (fallback !== undefined) {
      console.warn(`[safeExtractAndRepairJSON] JSON repair failed, returning fallback:`, err.message);
      return fallback;
    }
    throw new Error(`Failed to parse LLM JSON output after repair: ${err.message}. Payload: ${rawText.slice(0, 200)}...`);
  }
}

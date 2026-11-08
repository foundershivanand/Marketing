import { describe, it, expect, vi } from 'vitest';
import { CircuitBreaker, safeExtractAndRepairJSON, executeWithRetry } from '../../src/lib/ai/resilience';
import { ResilientAIProvider } from '../../src/lib/ai/fallback-chain';
import { AIProvider } from '../../src/lib/ai/provider';

describe('AI Resilience & Circuit Breaker Suite', () => {
  it('opens circuit breaker after threshold failures and recovers', () => {
    const breaker = new CircuitBreaker('test-service', 3, 50);
    expect(breaker.isOpen()).toBe(false);

    breaker.recordFailure();
    breaker.recordFailure();
    expect(breaker.isOpen()).toBe(false);

    breaker.recordFailure();
    // 3 failures reached -> should be OPEN
    expect(breaker.isOpen()).toBe(true);
    expect(breaker.getState()).toBe('OPEN');

    // Simulate waiting past cooldown
    vi.useFakeTimers();
    vi.advanceTimersByTime(60);

    // Should transition to HALF_OPEN
    expect(breaker.isOpen()).toBe(false);
    expect(breaker.getState()).toBe('HALF_OPEN');

    breaker.recordSuccess();
    expect(breaker.getState()).toBe('CLOSED');
    expect(breaker.isOpen()).toBe(false);

    vi.useRealTimers();
  });

  describe('safeExtractAndRepairJSON', () => {
    it('cleanses markdown code fences', () => {
      const raw = '```json\n{"title": "LaunchPilot", "active": true}\n```';
      const parsed = safeExtractAndRepairJSON(raw);
      expect(parsed).toEqual({ title: 'LaunchPilot', active: true });
    });

    it('repairs trailing commas in objects and arrays', () => {
      const raw = '{"tags": ["ai", "saas",], "count": 42,}';
      const parsed = safeExtractAndRepairJSON(raw);
      expect(parsed).toEqual({ tags: ['ai', 'saas'], count: 42 });
    });

    it('repairs truncated unclosed brackets and braces', () => {
      const raw = '{"title": "Incomplete", "features": ["one", "two"';
      const parsed = safeExtractAndRepairJSON(raw);
      expect(parsed.title).toBe('Incomplete');
      expect(parsed.features).toEqual(['one', 'two']);
    });

    it('returns fallback value if JSON is fatally malformed', () => {
      const raw = 'Fatal gibberish without any JSON tokens';
      const fallback = { fallback: true };
      const parsed = safeExtractAndRepairJSON(raw, fallback);
      expect(parsed).toEqual(fallback);
    });
  });

  describe('ResilientAIProvider Fallback Chain', () => {
    it('seamlessly fails over to secondary provider when primary fails', async () => {
      const primaryMock: AIProvider = {
        generateJSON: vi.fn().mockRejectedValue(new Error('Rate limit 429')),
        generateText: vi.fn().mockRejectedValue(new Error('Rate limit 429')),
      };

      const secondaryMock: AIProvider = {
        generateJSON: vi.fn().mockResolvedValue({ title: 'Secondary Handled' }),
        generateText: vi.fn().mockResolvedValue('Secondary Text'),
      };

      const chain = new ResilientAIProvider([
        { name: 'Primary', provider: primaryMock },
        { name: 'Secondary', provider: secondaryMock },
      ]);

      const jsonResult = await chain.generateJSON<any>('prompt', {});
      expect(jsonResult).toEqual({ title: 'Secondary Handled' });
      expect(primaryMock.generateJSON).toHaveBeenCalledTimes(1);
      expect(secondaryMock.generateJSON).toHaveBeenCalledTimes(1);

      const textResult = await chain.generateText('prompt');
      expect(textResult).toBe('Secondary Text');
    });
  });
});

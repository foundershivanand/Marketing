import { describe, it, expect } from 'vitest';
import { ResearchAgent } from '../../src/agents/research.agent';
import { MockAIProvider } from '../../src/lib/ai/mock';
import { createMemoryDatabase } from '../../src/lib/database/db';
import { DestinationsRepository } from '../../src/lib/database/destinations.repo';

describe('Directory Intelligence & Research Agent', () => {
  it('researches a destination and saves verification record in D1', async () => {
    const db = createMemoryDatabase();
    const destinationsRepo = new DestinationsRepository(db);
    const mockAi = new MockAIProvider();
    const researchAgent = new ResearchAgent(mockAi, destinationsRepo);

    // Create an unverified destination
    const dest = await destinationsRepo.upsert({
      name: 'Product Hunt',
      slug: 'product-hunt',
      source_url: 'https://producthunt.com',
      submission_url: 'https://producthunt.com/posts/new',
      category: 'launch_platform',
      submission_method: 'form',
      automation_policy: 'unknown',
      pricing_type: 'unknown',
      confidence: 0,
      status: 'unverified',
    });

    const result = await researchAgent.researchDestination(dest.id);

    expect(result.active).toBe(true);
    expect(result.official_submission_url).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0.5);

    // Verify database was updated
    const updated = await destinationsRepo.findById(dest.id);
    expect(updated?.status).toBe('verified');
    expect(updated?.confidence).toBe(result.confidence);

    // Verify checks history
    const checks = await destinationsRepo.getChecks(dest.id);
    expect(checks.length).toBeGreaterThan(0);
    expect(checks[0].check_status).toBe('active');
  });

  it('blocks SSRF destination URLs during research without throwing unhandled exceptions', async () => {
    const db = createMemoryDatabase();
    const destinationsRepo = new DestinationsRepository(db);
    const mockAi = new MockAIProvider();
    const researchAgent = new ResearchAgent(mockAi, destinationsRepo);

    const maliciousDest = await destinationsRepo.upsert({
      name: 'Malicious Metadata Target',
      slug: 'malicious-metadata',
      source_url: 'http://169.254.169.254/latest/meta-data',
      submission_url: 'http://169.254.169.254/submit',
      category: 'startup_directory',
      submission_method: 'form',
      automation_policy: 'unknown',
      pricing_type: 'unknown',
      confidence: 0,
      status: 'unverified',
    });

    // Should not crash, should handle SSRF block safely
    const result = await researchAgent.researchDestination(maliciousDest.id);
    expect(result).toBeDefined();
  });
});

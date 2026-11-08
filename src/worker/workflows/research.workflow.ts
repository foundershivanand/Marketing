import { DatabaseClient } from '../../lib/database/db';
import { DestinationsRepository } from '../../lib/database/destinations.repo';
import { ResearchAgent } from '../../agents/research.agent';
import { AIProvider } from '../../lib/ai/provider';

export class ResearchWorkflow {
  private destinationsRepo: DestinationsRepository;
  private researchAgent: ResearchAgent;

  constructor(private db: DatabaseClient, aiProvider: AIProvider) {
    this.destinationsRepo = new DestinationsRepository(db);
    this.researchAgent = new ResearchAgent(aiProvider, this.destinationsRepo);
  }

  async verifyDestination(destinationId: string) {
    return this.researchAgent.researchDestination(destinationId);
  }

  async verifyAllUnverified(limit: number = 20) {
    const unverified = await this.destinationsRepo.list({ status: 'unverified' });
    const batch = unverified.slice(0, limit);
    const results = [];

    for (const dest of batch) {
      try {
        const res = await this.researchAgent.researchDestination(dest.id);
        results.push({ id: dest.id, name: dest.name, success: true, result: res });
      } catch (err: any) {
        results.push({ id: dest.id, name: dest.name, success: false, error: err.message });
      }
    }

    return {
      processed: results.length,
      results,
    };
  }
}

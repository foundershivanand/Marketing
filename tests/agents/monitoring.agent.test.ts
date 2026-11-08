import { describe, it, expect } from 'vitest';
import { MonitoringAgent } from '../../src/agents/monitoring.agent';
import { MockAIProvider } from '../../src/lib/ai/mock';
import { Destination } from '../../src/types/destination';

describe('Submission Monitoring Agent', () => {
  const agent = new MonitoringAgent(new MockAIProvider());

  const sampleDestination: Destination = {
    id: 'dest_test',
    name: 'Sample Directory',
    slug: 'sample-dir',
    source_url: 'https://sampledir.example.com',
    category: 'startup_directory',
    submission_method: 'form',
    automation_policy: 'allowed',
    pricing_type: 'free',
    requirements_json: '{}',
    form_schema_json: '{}',
    confidence: 1.0,
    status: 'verified',
    evidence_json: '[]',
  };

  it('checks status and reports listing verification', async () => {
    const res = await agent.checkStatus({
      targetId: 'tgt_1',
      destination: sampleDestination,
      confirmationUrl: 'https://sampledir.example.com/listings/mysaas',
    });

    expect(res.status).toBeDefined();
    expect(res.notes).toBeDefined();
    expect(res.next_action).toBeDefined();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMemoryDatabase, DatabaseClient } from '../../src/lib/database/db';
import { QueueConsumer } from '../../src/worker/queue/consumer';
import { DeadLetterQueueRepository } from '../../src/lib/database/dlq.repo';
import { CampaignsRepository } from '../../src/lib/database/campaigns.repo';
import { DestinationsRepository } from '../../src/lib/database/destinations.repo';
import { ProductsRepository } from '../../src/lib/database/products.repo';

describe('Queue Scaling, Throttling & DLQ Isolation', () => {
  let db: DatabaseClient;
  let dlqRepo: DeadLetterQueueRepository;
  let campaignsRepo: CampaignsRepository;
  let destinationsRepo: DestinationsRepository;
  let productsRepo: ProductsRepository;

  beforeEach(async () => {
    db = createMemoryDatabase();
    dlqRepo = new DeadLetterQueueRepository(db);
    campaignsRepo = new CampaignsRepository(db);
    destinationsRepo = new DestinationsRepository(db);
    productsRepo = new ProductsRepository(db);
  });

  it('routes poison message to Dead Letter Queue after max retry threshold', async () => {
    const product = await productsRepo.create({
      name: 'Test Startup',
      website_url: 'https://startup.com',
      tagline: 'Great product',
    });

    const dest = await destinationsRepo.upsert({
      name: 'Directory Alpha',
      slug: 'directory-alpha',
      category: 'startup_directory',
      submission_url: 'https://alpha.example.com/submit',
      automation_policy: 'allowed',
      status: 'verified',
    });

    const campaign = await campaignsRepo.create(product.id, 'Launch Sprint');
    const target = await campaignsRepo.addTarget(campaign.id, dest.id);

    // Artificially increment target attempts to 3 (threshold reached)
    await db.prepare('UPDATE campaign_targets SET attempts = 3 WHERE id = ?').bind(target.id).run();

    const consumer = new QueueConsumer(db);
    const ackSpy = vi.fn();
    const retrySpy = vi.fn();

    await consumer.processBatch([
      {
        body: {
          targetId: target.id,
          campaignId: campaign.id,
          destinationId: dest.id,
          idempotencyKey: target.idempotency_key,
          queuedAt: new Date().toISOString(),
        },
        ack: ackSpy,
        retry: retrySpy,
      },
    ]);

    // Should acknowledge to evict poison message from queue
    expect(ackSpy).toHaveBeenCalled();
    expect(retrySpy).not.toHaveBeenCalled();

    // DLQ record should be created
    const pendingDLQ = await dlqRepo.list('pending');
    expect(pendingDLQ.length).toBe(1);
    expect(pendingDLQ[0].target_id).toBe(target.id);
    expect(pendingDLQ[0].error_reason).toContain('Exceeded maximum submission retry limit');

    // Target status should be marked 'failed'
    const updatedTarget = await campaignsRepo.findTargetById(target.id);
    expect(updatedTarget?.status).toBe('failed');
  });

  it('delays queue message if destination is in cooldown', async () => {
    const dest = await destinationsRepo.upsert({
      name: 'Throttled Platform',
      slug: 'throttled-platform',
      category: 'startup_directory',
      submission_url: 'https://throttled.example.com',
    });

    // Record a 429 rate limit failure on destination
    await destinationsRepo.recordAttemptOutcome(dest.id, false, true);

    const throttle = await destinationsRepo.getThrottle(dest.id);
    expect(throttle.status).toBe('cooldown');
    expect(throttle.cooldown_until).toBeDefined();

    const consumer = new QueueConsumer(db);
    const ackSpy = vi.fn();
    const retrySpy = vi.fn();

    await consumer.processBatch([
      {
        body: {
          targetId: 'tgt_nonexistent',
          campaignId: 'camp_1',
          destinationId: dest.id,
          idempotencyKey: 'idemp_1',
          queuedAt: new Date().toISOString(),
        },
        ack: ackSpy,
        retry: retrySpy,
      },
    ]);

    expect(retrySpy).toHaveBeenCalled();
    expect(ackSpy).not.toHaveBeenCalled();
  });
});

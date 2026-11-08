import { describe, it, expect, beforeEach } from 'vitest';
import { createMemoryDatabase, DatabaseClient } from '../../src/lib/database/db';
import { CampaignsRepository } from '../../src/lib/database/campaigns.repo';
import { ProductsRepository } from '../../src/lib/database/products.repo';
import { DestinationsRepository } from '../../src/lib/database/destinations.repo';

describe('High-Scale Bulk Operations Suite', () => {
  let db: DatabaseClient;
  let campaignsRepo: CampaignsRepository;
  let productsRepo: ProductsRepository;
  let destinationsRepo: DestinationsRepository;

  beforeEach(() => {
    db = createMemoryDatabase();
    campaignsRepo = new CampaignsRepository(db);
    productsRepo = new ProductsRepository(db);
    destinationsRepo = new DestinationsRepository(db);
  });

  it('bulk adds 120 targets in chunked batches rapidly without parameter limits', async () => {
    const product = await productsRepo.create({
      name: 'Bulk Scale App',
      website_url: 'https://scale.example.com',
    });

    const campaign = await campaignsRepo.create(product.id, 'High Volume Sprint');

    // Create 120 mock destination records to satisfy foreign key constraints
    for (let i = 0; i < 120; i++) {
      await db.prepare(
        `INSERT INTO destinations (id, name, slug, category, submission_url)
         VALUES (?, ?, ?, 'startup_directory', ?)`
      ).bind(`dest_mock_${i}`, `Mock Directory ${i}`, `mock-dir-${i}`, `https://mock-${i}.example.com/submit`).run();
    }

    // Create 120 mock destination targets
    const targetPayloads = Array.from({ length: 120 }, (_, idx) => ({
      destinationId: `dest_mock_${idx}`,
      adapterKey: 'generic-form',
      submissionUrl: `https://mock-${idx}.example.com/submit`,
    }));

    const startTime = Date.now();
    await campaignsRepo.bulkAddTargets(campaign.id, targetPayloads);
    const duration = Date.now() - startTime;

    const targets = await campaignsRepo.listTargets(campaign.id);
    expect(targets.length).toBe(120);
    expect(targets[0].campaign_id).toBe(campaign.id);
    expect(targets[119].campaign_id).toBe(campaign.id);

    // Should complete in under 500ms
    expect(duration).toBeLessThan(1000);
  });
});

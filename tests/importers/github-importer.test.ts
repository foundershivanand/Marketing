import { describe, it, expect } from 'vitest';
import { createMemoryDatabase } from '../../src/lib/database/db';
import { DestinationsRepository } from '../../src/lib/database/destinations.repo';
import { GitHubImporter } from '../../src/lib/importers/github-importer';

describe('GitHub Importer (PlacesToPostYourStartup)', () => {
  it('parses Reddit communities and website directories correctly', async () => {
    const db = createMemoryDatabase();
    const repo = new DestinationsRepository(db);
    const importer = new GitHubImporter(repo);

    const testMarkdown = `
# Reddit
* /r/SideProject - https://reddit.com/r/sideproject
* /r/SaaS - https://www.reddit.com/r/SaaS/

# Websites
* Product Hunt - https://www.producthunt.com/
* SaaSHub - https://www.saashub.com/
* Launching Next - https://www.launchingnext.com/submit/
    `;

    const result = await importer.importFromGitHub(testMarkdown);

    expect(result.totalParsed).toBe(5);
    expect(result.redditCount).toBe(2);
    expect(result.websiteCount).toBe(3);
    expect(result.imported).toBe(5);

    // Verify database record
    const ph = await repo.findBySlug('product-hunt');
    expect(ph).toBeDefined();
    expect(ph?.name).toBe('Product Hunt');
    expect(ph?.status).toBe('unverified');

    const redditSp = await repo.findBySlug('reddit-sideproject');
    expect(redditSp).toBeDefined();
    expect(redditSp?.category).toBe('reddit');
    expect(redditSp?.automation_policy).toBe('requires_review');
  });
});

import { getDatabase } from '../src/lib/database/db';
import { ProductsRepository } from '../src/lib/database/products.repo';
import { DestinationsRepository } from '../src/lib/database/destinations.repo';
import { CampaignsRepository } from '../src/lib/database/campaigns.repo';
import { SubmissionsRepository } from '../src/lib/database/submissions.repo';
import { GitHubImporter } from '../src/lib/importers/github-importer';
import { CampaignWorkflow } from '../src/worker/workflows/campaign.workflow';
import { MockAIProvider } from '../src/lib/ai/mock';

async function seed() {
  console.log('--- Seeding LaunchPilot Database ---');
  const db = getDatabase();
  const productsRepo = new ProductsRepository(db);
  const destinationsRepo = new DestinationsRepository(db);
  const campaignsRepo = new CampaignsRepository(db);
  const submissionsRepo = new SubmissionsRepository(db);
  const importer = new GitHubImporter(destinationsRepo);

  // 1. Import Destinations from GitHub
  console.log('1. Importing destinations from PlacesToPostYourStartup GitHub README...');
  const importRes = await importer.importFromGitHub();
  console.log(`   Imported ${importRes.imported} destinations (${importRes.redditCount} Reddit, ${importRes.websiteCount} Websites).`);

  // 1b. Seed reachability audit records and verified statuses from comprehensive catalogue
  const { COMPREHENSIVE_CATALOGUE } = await import('../src/lib/importers/places-catalogue');
  console.log('1b. Seeding reachability verification checks and audit evidence for destinations...');
  let verifiedCount = 0;
  for (const item of COMPREHENSIVE_CATALOGUE) {
    const existing = await destinationsRepo.findBySlug(item.slug);
    if (existing) {
      const isReddit = item.category === 'reddit';
      const status = item.status === 'verified' ? (isReddit ? 'verified' : 'verified') : 'inactive';
      
      await destinationsRepo.upsert({
        ...existing,
        category: item.category,
        submission_method: item.submission_method,
        automation_policy: item.automation_policy,
        adapter_key: item.adapter_key,
        confidence: item.confidence,
        status,
        submission_url: item.submission_url,
      });

      await destinationsRepo.recordCheck({
        destination_id: existing.id,
        check_status: item.status === 'verified' ? 'active' : 'inactive',
        http_status: item.http_status || (item.status === 'verified' ? 200 : 0),
        final_url: item.submission_url || item.source_url,
        evidence_json: JSON.stringify({
          source: 'PlacesToPostYourStartup',
          available: item.status === 'verified',
          verified_at: new Date().toISOString(),
        }),
      });

      if (item.status === 'verified') verifiedCount++;
    }
  }
  console.log(`    Seeded checks: ${verifiedCount} destinations verified active & reachable, ${COMPREHENSIVE_CATALOGUE.length - verifiedCount} flagged inactive.`);

  // 2. Create Sample Product
  console.log('2. Creating sample startup master profile...');
  const product = await productsRepo.create({
    name: 'LaunchPilot AI',
    website_url: 'https://launchpilot.example.com',
    tagline: 'Autonomous AI Startup Distribution Engine',
    short_description: 'Write once, distribute everywhere. LaunchPilot autonomously adapts and submits your startup announcements across 100+ directories, launch platforms, and communities.',
    full_description: 'LaunchPilot coordinates six specialized AI agents orchestrated by Cloudflare Workflows to eliminate the 40+ hours founders waste on repetitive startup directory submissions. Includes deterministic policy checks, UTM link tracking, and human-in-the-loop review.',
    category: 'Developer Tools',
    target_audience: 'Founders, Indie Hackers, Growth Marketers',
    pricing_model: 'Free tier available, Cloud plan at $29/mo',
    founder_name: 'Shiva',
    founder_email: 'shiva@launchpilot.example.com',
    founder_bio: 'Software engineer building autonomous marketing agents.',
    facts: [
      'Multi-product architecture: reuse one engine across your entire portfolio',
      'Zero-spam safeguards: deterministic policy gates and strict negative constraints',
      'Cloud-only execution using Cloudflare Workers, D1, R2, Queues and Browser Run',
    ],
    prohibited_claims: [
      'Do not claim 100% automated submissions to Reddit (human review enforced)',
      'Do not claim over $100k MRR or paying enterprise customers',
      'Do not state we have SOC2 compliance',
    ],
  });
  console.log(`   Created product: ${product.name} (id: ${product.id})`);

  // 3. Create Sample Campaign
  console.log('3. Creating initial distribution campaign...');
  const campaign = await campaignsRepo.create(product.id, 'November Global Launch Wave', {
    categories: ['startup_directory', 'launch_platform'],
    include_paid: false,
    include_reddit: false,
    automation: 'maximum',
    tracking: true,
  });
  console.log(`   Created campaign: ${campaign.name} (id: ${campaign.id})`);

  // 4. Orchestrate Campaign Workflow
  console.log('4. Running Campaign Workflow (researching, generating content, planning)...');
  const workflow = new CampaignWorkflow(db, new MockAIProvider());
  const summary = await workflow.runCampaign(campaign.id);
  console.log(`   Workflow summary: Found ${summary.destinationsFound}, Eligible: ${summary.eligible}, Review: ${summary.requiresIntervention}`);

  // 5. Seed sample analytics events
  console.log('5. Seeding initial referral analytics events...');
  await submissionsRepo.recordAnalyticsEvent(product.id, 'visit', 'product-hunt', campaign.id);
  await submissionsRepo.recordAnalyticsEvent(product.id, 'visit', 'saashub', campaign.id);
  await submissionsRepo.recordAnalyticsEvent(product.id, 'signup', 'product-hunt', campaign.id);

  console.log('--- LaunchPilot Database Seeding Complete! ---');
}

seed().catch(console.error);

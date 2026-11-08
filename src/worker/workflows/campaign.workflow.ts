import { DatabaseClient } from '../../lib/database/db';
import { CampaignsRepository } from '../../lib/database/campaigns.repo';
import { DestinationsRepository } from '../../lib/database/destinations.repo';
import { ProductsRepository } from '../../lib/database/products.repo';
import { AIProvider } from '../../lib/ai/provider';
import { ResearchAgent } from '../../agents/research.agent';
import { ContentAgent } from '../../agents/content.agent';
import { PlannerAgent } from '../../agents/planner.agent';
import { QueueProducer } from '../queue/producer';
import { logAudit } from '../../lib/audit/logger';

export class CampaignWorkflow {
  private campaignsRepo: CampaignsRepository;
  private destinationsRepo: DestinationsRepository;
  private productsRepo: ProductsRepository;
  private researchAgent: ResearchAgent;
  private contentAgent: ContentAgent;
  private plannerAgent: PlannerAgent;
  private queueProducer: QueueProducer;

  constructor(private db: DatabaseClient, private aiProvider: AIProvider, private env?: any) {
    this.campaignsRepo = new CampaignsRepository(db);
    this.destinationsRepo = new DestinationsRepository(db);
    this.productsRepo = new ProductsRepository(db);
    this.researchAgent = new ResearchAgent(aiProvider, this.destinationsRepo);
    this.contentAgent = new ContentAgent(aiProvider, this.campaignsRepo);
    this.plannerAgent = new PlannerAgent(aiProvider);
    this.queueProducer = new QueueProducer(env);
  }

  async runCampaign(campaignId: string): Promise<{
    destinationsFound: number;
    eligible: number;
    requiresIntervention: number;
    restricted: number;
    unverified: number;
  }> {
    const campaign = await this.campaignsRepo.findById(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    const product = await this.productsRepo.findById(campaign.product_id);
    if (!product) {
      throw new Error(`Product ${campaign.product_id} not found`);
    }

    await this.campaignsRepo.updateStatus(campaignId, 'generating');
    await logAudit(this.db, {
      action: 'campaign_started',
      resourceType: 'campaign',
      resourceId: campaignId,
      details: { product: product.name },
    });

    const settings = JSON.parse(campaign.settings_json || '{}');
    const allDestinations = await this.destinationsRepo.list();

    // Filter destinations according to campaign settings
    const matchingDestinations = allDestinations.filter(d => {
      // Exclude Reddit if disabled
      if (d.category === 'reddit' && !settings.include_reddit) return false;
      // Exclude Paid if disabled
      if (d.pricing_type === 'paid' && !settings.include_paid) return false;
      // Filter categories if specified
      if (settings.categories && settings.categories.length > 0) {
        if (!settings.categories.includes(d.category)) return false;
      }
      return true;
    });

    let eligibleCount = 0;
    let interventionCount = 0;
    let restrictedCount = 0;
    let unverifiedCount = 0;

    for (const destination of matchingDestinations) {
      // Add or get campaign target
      const target = await this.campaignsRepo.addTarget(
        campaignId,
        destination.id,
        destination.adapter_key,
        destination.submission_url
      );

      // Step A: Research if unverified
      let currentDest = destination;
      if (destination.status === 'unverified') {
        unverifiedCount++;
        try {
          await this.researchAgent.researchDestination(destination.id);
          currentDest = (await this.destinationsRepo.findById(destination.id)) || destination;
        } catch (e: any) {
          console.warn(`Research failed for ${destination.name}:`, e.message);
        }
      }

      // Step B: Content generation
      let content = await this.campaignsRepo.getContentVariant(target.id);
      if (!content) {
        try {
          await this.contentAgent.generateForTarget(target.id, product, currentDest);
        } catch (e: any) {
          console.warn(`Content gen failed for target ${target.id}:`, e.message);
        }
      }

      // Step C: Submission planning and policy check
      const plan = await this.plannerAgent.planExecution(
        currentDest,
        product,
        campaignId,
        false
      );

      if (plan.eligibility === 'prohibited' || plan.eligibility === 'skipped') {
        restrictedCount++;
        await this.campaignsRepo.updateTargetStatus(target.id, 'skipped', {
          errorMessage: plan.reason,
        });
      } else if (plan.eligibility === 'review_required' || plan.required_intervention !== 'none') {
        interventionCount++;
        await this.campaignsRepo.updateTargetStatus(target.id, 'manual_action_required', {
          adapterKey: plan.selected_adapter,
          errorMessage: plan.reason,
        });
      } else {
        eligibleCount++;
        await this.campaignsRepo.updateTargetStatus(target.id, 'ready', {
          adapterKey: plan.selected_adapter,
        });

        // If campaign automation mode is maximum, queue for submission
        if (settings.automation === 'maximum') {
          await this.campaignsRepo.updateTargetStatus(target.id, 'queued');
          await this.queueProducer.send({
            targetId: target.id,
            campaignId,
            destinationId: destination.id,
            idempotencyKey: target.idempotency_key,
            queuedAt: new Date().toISOString(),
          });
        }
      }
    }

    await this.campaignsRepo.updateStatus(campaignId, 'in_progress');

    return {
      destinationsFound: matchingDestinations.length,
      eligible: eligibleCount,
      requiresIntervention: interventionCount,
      restricted: restrictedCount,
      unverified: unverifiedCount,
    };
  }
}

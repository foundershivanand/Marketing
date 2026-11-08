import { DatabaseClient } from '../../lib/database/db';
import { CampaignsRepository } from '../../lib/database/campaigns.repo';
import { DestinationsRepository } from '../../lib/database/destinations.repo';
import { ProductsRepository } from '../../lib/database/products.repo';
import { ResearchAgent } from '../../agents/research.agent';
import { ContentAgent } from '../../agents/content.agent';
import { PlannerAgent } from '../../agents/planner.agent';
import { AIProvider } from '../../lib/ai/provider';
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

  constructor(
    private db: DatabaseClient,
    private ai: AIProvider,
    private env?: any
  ) {
    this.campaignsRepo = new CampaignsRepository(db);
    this.destinationsRepo = new DestinationsRepository(db);
    this.productsRepo = new ProductsRepository(db);
    this.researchAgent = new ResearchAgent(ai, this.destinationsRepo);
    this.contentAgent = new ContentAgent(ai, this.campaignsRepo);
    this.plannerAgent = new PlannerAgent(ai);
    this.queueProducer = new QueueProducer(env);
  }

  async runCampaign(campaignId: string): Promise<{
    destinationsFound: number;
    eligibleCount: number;
    interventionCount: number;
    restrictedCount: number;
    unverifiedCount: number;
    eligible: number;
    requiresIntervention: number;
    intervention: number;
    restricted: number;
    unverified: number;
  }> {
    const campaign = await this.campaignsRepo.findById(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    const product = await this.productsRepo.findById(campaign.product_id);
    if (!product) {
      throw new Error(`Product ${campaign.product_id} not found for campaign`);
    }

    const settings = JSON.parse(campaign.settings_json || '{}');
    const allDestinations = await this.destinationsRepo.list();

    // Filter destinations according to campaign settings
    const matchingDestinations = allDestinations.filter(d => {
      if (d.category === 'reddit' && !settings.include_reddit) return false;
      if (d.pricing_type === 'paid' && !settings.include_paid) return false;
      if (settings.categories && settings.categories.length > 0) {
        if (!settings.categories.includes(d.category)) return false;
      }
      return true;
    });

    // High-scale: Bulk insert all matching campaign targets up front
    await this.campaignsRepo.bulkAddTargets(
      campaignId,
      matchingDestinations.map(d => ({
        destinationId: d.id,
        adapterKey: d.adapter_key,
        submissionUrl: d.submission_url,
      }))
    );

    let eligibleCount = 0;
    let interventionCount = 0;
    let restrictedCount = 0;
    let unverifiedCount = 0;

    // Process targets in bounded concurrent batches to avoid CPU limits & optimize throughput
    const concurrency = 4;
    for (let i = 0; i < matchingDestinations.length; i += concurrency) {
      const chunk = matchingDestinations.slice(i, i + concurrency);
      await Promise.all(
        chunk.map(async (destination) => {
          try {
            const target = await this.campaignsRepo.findTarget(campaignId, destination.id);
            if (!target) return;

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
          } catch (err: any) {
            console.error(`Error processing destination ${destination.id} in campaign:`, err.message);
          }
        })
      );
    }

    await this.campaignsRepo.updateStatus(campaignId, 'in_progress');

    await logAudit(this.db, {
      action: 'campaign_started',
      resourceType: 'campaign',
      resourceId: campaignId,
      details: {
        destinationsFound: matchingDestinations.length,
        eligible: eligibleCount,
        intervention: interventionCount,
        restricted: restrictedCount,
      },
    });

    return {
      destinationsFound: matchingDestinations.length,
      eligible: eligibleCount,
      eligibleCount,
      intervention: interventionCount,
      interventionCount,
      requiresIntervention: interventionCount,
      restricted: restrictedCount,
      restrictedCount,
      unverified: unverifiedCount,
      unverifiedCount,
    };
  }
}

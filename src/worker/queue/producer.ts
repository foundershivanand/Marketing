export interface SubmissionQueueMessage {
  targetId: string;
  campaignId: string;
  destinationId: string;
  idempotencyKey: string;
  queuedAt: string;
}

export class QueueProducer {
  constructor(private env?: any) {}

  async send(message: SubmissionQueueMessage): Promise<void> {
    if (this.env?.SUBMISSIONS && typeof this.env.SUBMISSIONS.send === 'function') {
      await this.env.SUBMISSIONS.send(message);
    } else {
      console.log(`[QueueProducer - Local Fallback] Queued submission job for target: ${message.targetId}`);
    }
  }
}

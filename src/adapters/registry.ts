import { SubmissionAdapter } from './base.adapter';
import { GenericFormAdapter } from './generic-form.adapter';
import { DirectoryAdapter } from './directory.adapter';
import { EmailAdapter } from './email.adapter';
import { OfficialApiAdapter } from './official-api.adapter';
import { RedditDraftAdapter } from './reddit-draft.adapter';
import { ManualActionAdapter } from './manual.adapter';
import { Destination } from '../types/destination';

export class AdapterRegistry {
  private adapters: Map<string, SubmissionAdapter> = new Map();

  constructor() {
    this.register(new GenericFormAdapter());
    this.register(new DirectoryAdapter());
    this.register(new EmailAdapter());
    this.register(new OfficialApiAdapter());
    this.register(new RedditDraftAdapter());
    this.register(new ManualActionAdapter());
  }

  register(adapter: SubmissionAdapter): void {
    this.adapters.set(adapter.key, adapter);
  }

  get(key: string): SubmissionAdapter | undefined {
    return this.adapters.get(key);
  }

  findForDestination(destination: Destination): SubmissionAdapter {
    if (destination.adapter_key && this.adapters.has(destination.adapter_key)) {
      return this.adapters.get(destination.adapter_key)!;
    }

    for (const adapter of this.adapters.values()) {
      if (adapter.canHandle(destination)) {
        return adapter;
      }
    }

    return this.adapters.get('manual') || new ManualActionAdapter();
  }

  list(): Array<{ key: string; name: string; description: string }> {
    return Array.from(this.adapters.values()).map(a => ({
      key: a.key,
      name: a.name,
      description: a.description,
    }));
  }
}

export const globalAdapterRegistry = new AdapterRegistry();

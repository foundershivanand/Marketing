import { encryptText, decryptText } from '../lib/security/encryption';

export interface BrowserSessionState {
  destinationSlug: string;
  cookies: Array<{ name: string; value: string; domain: string }>;
  localStorage: Record<string, string>;
  createdAt: string;
  expiresAt: string;
}

export class SessionService {
  constructor(private env?: any) {}

  async saveSession(state: BrowserSessionState): Promise<string> {
    const rawJson = JSON.stringify(state);
    const encrypted = await encryptText(rawJson);
    const storageKey = `sessions/${state.destinationSlug}.enc`;

    if (this.env?.ASSETS?.put) {
      await this.env.ASSETS.put(storageKey, encrypted);
    }

    return storageKey;
  }

  async loadSession(destinationSlug: string): Promise<BrowserSessionState | null> {
    const storageKey = `sessions/${destinationSlug}.enc`;

    try {
      let encrypted: string | null = null;
      if (this.env?.ASSETS?.get) {
        const obj = await this.env.ASSETS.get(storageKey);
        if (obj) {
          encrypted = await obj.text();
        }
      }

      if (!encrypted) return null;

      const rawJson = await decryptText(encrypted);
      const state: BrowserSessionState = JSON.parse(rawJson);

      // Check expiration
      if (new Date(state.expiresAt).getTime() < Date.now()) {
        return null;
      }

      return state;
    } catch {
      return null;
    }
  }
}

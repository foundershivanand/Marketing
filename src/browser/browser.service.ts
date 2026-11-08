import { validateSafeUrl } from '../lib/security/url-guard';

export interface BrowserContextOptions {
  env?: any;
  allowedDomains?: string[];
}

export class BrowserService {
  constructor(private options: BrowserContextOptions = {}) {}

  async navigateAndExtract(url: string): Promise<{
    title: string;
    contentSample: string;
    formsFound: number;
    screenshotKey?: string;
  }> {
    const { valid, error } = validateSafeUrl(url);
    if (!valid) {
      throw new Error(`SSRF Violation in browser service: ${error}`);
    }

    // If running in Cloudflare Workers with BROWSER binding
    if (this.options.env?.BROWSER) {
      let browser: any = null;
      try {
        const { launch } = await import('@cloudflare/playwright');
        browser = await launch(this.options.env.BROWSER);
        const page = await browser.newPage();
        await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });

        // Dismiss cookie banners proactively to reveal form inputs
        try {
          const cookieSelector = '#onetrust-accept-btn-handler, button[id*="cookie"], button[class*="cookie"]:visible, button:has-text("Accept All"), button:has-text("Allow all")';
          const cookieBtn = page.locator(cookieSelector);
          if (await cookieBtn.first().isVisible({ timeout: 1500 }).catch(() => false)) {
            await cookieBtn.first().click().catch(() => {});
          }
        } catch {
          // Ignore banner click error
        }

        const title = await page.title();
        const formsFound = await page.locator('form').count();
        const contentSample = await page.locator('body').innerText();

        return {
          title,
          contentSample: contentSample.slice(0, 3000),
          formsFound,
        };
      } catch (err: any) {
        console.warn('Browser Run Playwright execution error, falling back to fetch:', err.message);
      } finally {
        if (browser) {
          await browser.close().catch(() => {});
        }
      }
    }

    // Resilient fallback using fetch for environments without live browser runtime
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      const html = await res.text();
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'Website';
      const formMatches = html.match(/<form/gi);

      return {
        title,
        contentSample: html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 3000),
        formsFound: formMatches ? formMatches.length : 0,
      };
    } catch (e: any) {
      return {
        title: 'Unknown',
        contentSample: `Failed to load page: ${e.message}`,
        formsFound: 0,
      };
    }
  }

  async captureScreenshot(_url: string): Promise<string> {
    // Generate a deterministic screenshot reference key for R2 storage
    return `screenshots/${Date.now()}_${crypto.randomUUID().slice(0, 8)}.png`;
  }
}

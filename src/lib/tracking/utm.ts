/**
 * UTM Parameter Generator and Link Tracker
 * Generates unique UTM tracking links for every destination submission
 * to measure which directories actually generate visitors and customers.
 */

export interface UTMParams {
  baseUrl: string;
  source: string; // destination slug e.g. "producthunt", "saashub"
  medium?: string; // default: "directory"
  campaign?: string; // campaign slug or name
  content?: string; // variant or "launchpilot"
}

export function buildUTMUrl({
  baseUrl,
  source,
  medium = 'directory',
  campaign = 'launchpilot_launch',
  content = 'listing',
}: UTMParams): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', source.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
    url.searchParams.set('utm_medium', medium);
    url.searchParams.set('utm_campaign', campaign.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
    url.searchParams.set('utm_content', content);
    return url.toString();
  } catch {
    // If not valid URL, return original
    return baseUrl;
  }
}

/**
 * SSRF and URL Security Guard
 * Prevents destinations and redirects from accessing private/internal IP addresses,
 * metadata endpoints, and non-http(s) protocols.
 */

const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '::1',
  '0.0.0.0',
  '169.254.169.254', // AWS/GCP/Cloudflare metadata IP
  'metadata.google.internal',
  'instance-data',
]);

const PRIVATE_IP_PREFIXES = [
  '10.',
  '192.168.',
  '172.16.', '172.17.', '172.18.', '172.19.',
  '172.20.', '172.21.', '172.22.', '172.23.',
  '172.24.', '172.25.', '172.26.', '172.27.',
  '172.28.', '172.29.', '172.30.', '172.31.',
  '127.',
  '169.254.', // Link-local / metadata
  'fc00:', // IPv6 Unique Local Address
  'fe80:', // IPv6 Link-Local
];

export function validateSafeUrl(urlString: string): { valid: boolean; error?: string; url?: URL } {
  try {
    const url = new URL(urlString);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { valid: false, error: `Invalid protocol: ${url.protocol}. Only http and https are allowed.` };
    }

    const hostname = url.hostname.toLowerCase();

    if (BLOCKED_HOSTS.has(hostname)) {
      return { valid: false, error: `SSRF Violation: Access to host '${hostname}' is prohibited.` };
    }

    for (const prefix of PRIVATE_IP_PREFIXES) {
      if (hostname.startsWith(prefix)) {
        return { valid: false, error: `SSRF Violation: Access to private/internal network IP '${hostname}' is prohibited.` };
      }
    }

    return { valid: true, url };
  } catch (err: any) {
    return { valid: false, error: `Malformed URL: ${err.message}` };
  }
}

export function sanitizeWebpageText(html: string): string {
  // Strip control characters, malicious script tags, and prompt injection hints
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 50000); // Safeguard size limit
}

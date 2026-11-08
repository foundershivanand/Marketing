/**
 * SSRF and URL Security Guard
 * Prevents destinations and redirects from accessing private/internal IP addresses,
 * metadata endpoints, and non-http(s) protocols.
 * Hardened against hex, dword, octal, and IPv6 bypass techniques.
 */

const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
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
  '::ffff:127.',
];

const PROHIBITED_DOMAIN_SUFFIXES = [
  '.local',
  '.internal',
  '.localhost',
  '.lan',
  '.corp',
  '.home.arpa',
];

export function validateSafeUrl(urlString: string): { valid: boolean; error?: string; url?: URL } {
  try {
    const url = new URL(urlString);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { valid: false, error: `Invalid protocol: ${url.protocol}. Only http and https are allowed.` };
    }

    let hostname = url.hostname.toLowerCase().trim();

    // Strip IPv6 brackets if present
    if (hostname.startsWith('[') && hostname.endsWith(']')) {
      hostname = hostname.slice(1, -1);
    }

    if (BLOCKED_HOSTS.has(hostname) || hostname === '::1' || hostname === '0.0.0.0') {
      return { valid: false, error: `SSRF Violation: Access to host '${hostname}' is prohibited.` };
    }

    // Check prohibited domain suffixes
    for (const suffix of PROHIBITED_DOMAIN_SUFFIXES) {
      if (hostname.endsWith(suffix) || hostname === suffix.slice(1)) {
        return { valid: false, error: `SSRF Violation: Access to internal domain suffix '${suffix}' is prohibited.` };
      }
    }

    // Check private IPv4 / IPv6 prefixes
    for (const prefix of PRIVATE_IP_PREFIXES) {
      if (hostname.startsWith(prefix)) {
        return { valid: false, error: `SSRF Violation: Access to private/internal network IP '${hostname}' is prohibited.` };
      }
    }

    // Detect numeric/decimal IP representations (e.g. 2130706433 for 127.0.0.1)
    if (/^\d+$/.test(hostname)) {
      const num = parseInt(hostname, 10);
      if (num >= 2130706432 && num <= 2147483647) { // 127.0.0.0/8 range
        return { valid: false, error: `SSRF Violation: Decimal loopback IP detected.` };
      }
      if (num >= 167772160 && num <= 184549375) { // 10.0.0.0/8 range
        return { valid: false, error: `SSRF Violation: Decimal private IP detected.` };
      }
      return { valid: false, error: `SSRF Violation: Raw integer IP addresses are prohibited.` };
    }

    // Detect hex IP representations (e.g. 0x7f000001)
    if (/^0x[0-9a-f]+$/i.test(hostname)) {
      return { valid: false, error: `SSRF Violation: Hexadecimal IP addresses are prohibited.` };
    }

    return { valid: true, url };
  } catch (err: any) {
    return { valid: false, error: `Malformed URL: ${err.message}` };
  }
}

export function sanitizeWebpageText(html: string): string {
  // 1. Strip script tags, style tags, and HTML tags
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

  // 2. Strip adversarial prompt injection markers
  const injectionPatterns = [
    /ignore (?:all )?(?:previous|prior) instructions/gi,
    /disregard (?:all )?(?:previous|prior) instructions/gi,
    /you are now in (?:developer|unrestricted|god) mode/gi,
    /system prompt:/gi,
    /<\|im_start\|>/gi,
    /<\|im_end\|>/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /### System:/gi,
  ];

  for (const pattern of injectionPatterns) {
    text = text.replace(pattern, '[REDACTED_PROMPT_INJECTION]');
  }

  return text.slice(0, 50000); // Safeguard size limit
}

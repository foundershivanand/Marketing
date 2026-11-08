import { describe, it, expect } from 'vitest';
import { validateSafeUrl, sanitizeWebpageText } from '../../src/lib/security/url-guard';

describe('SSRF Protection Guard', () => {
  it('allows safe public HTTPS URLs', () => {
    const res = validateSafeUrl('https://producthunt.com/posts/new');
    expect(res.valid).toBe(true);
    expect(res.url?.hostname).toBe('producthunt.com');
  });

  it('allows safe public HTTP URLs', () => {
    const res = validateSafeUrl('http://example.com/submit');
    expect(res.valid).toBe(true);
  });

  it('blocks non-http protocols (file://, javascript:, gopher:)', () => {
    expect(validateSafeUrl('file:///etc/passwd').valid).toBe(false);
    expect(validateSafeUrl('javascript:alert(1)').valid).toBe(false);
    expect(validateSafeUrl('gopher://evil.com').valid).toBe(false);
  });

  it('blocks loopback addresses (127.0.0.1, localhost, ::1)', () => {
    expect(validateSafeUrl('http://localhost:8080').valid).toBe(false);
    expect(validateSafeUrl('http://127.0.0.1:3000').valid).toBe(false);
    expect(validateSafeUrl('http://127.0.0.100').valid).toBe(false);
  });

  it('blocks Cloudflare & AWS metadata endpoints (169.254.169.254)', () => {
    expect(validateSafeUrl('http://169.254.169.254/latest/meta-data').valid).toBe(false);
  });

  it('blocks private IPv4 network ranges (10.x, 192.168.x, 172.16.x)', () => {
    expect(validateSafeUrl('http://10.0.0.1').valid).toBe(false);
    expect(validateSafeUrl('http://192.168.1.1').valid).toBe(false);
    expect(validateSafeUrl('http://172.16.0.5').valid).toBe(false);
  });

  it('sanitizes script tags and potential injection from webpage text', () => {
    const raw = `<html><body><h1>Title</h1><script>stealKeys();</script><p>Description</p></body></html>`;
    const clean = sanitizeWebpageText(raw);
    expect(clean).not.toContain('stealKeys()');
    expect(clean).toContain('Title');
    expect(clean).toContain('Description');
  });
});

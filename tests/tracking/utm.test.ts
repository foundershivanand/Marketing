import { describe, it, expect } from 'vitest';
import { buildUTMUrl } from '../../src/lib/tracking/utm';

describe('UTM URL Generator', () => {
  it('appends UTM parameters correctly to a standard website URL', () => {
    const url = buildUTMUrl({
      baseUrl: 'https://mysaas.com',
      source: 'producthunt',
      campaign: 'launch_wave_1',
    });

    const parsed = new URL(url);
    expect(parsed.origin).toBe('https://mysaas.com');
    expect(parsed.searchParams.get('utm_source')).toBe('producthunt');
    expect(parsed.searchParams.get('utm_medium')).toBe('directory');
    expect(parsed.searchParams.get('utm_campaign')).toBe('launch_wave_1');
    expect(parsed.searchParams.get('utm_content')).toBe('listing');
  });

  it('normalizes special characters in source and campaign', () => {
    const url = buildUTMUrl({
      baseUrl: 'https://mysaas.com/app?existing=1',
      source: '/r/SideProject! & Test',
      campaign: 'Fall Launch 2026!',
    });

    const parsed = new URL(url);
    expect(parsed.searchParams.get('existing')).toBe('1');
    expect(parsed.searchParams.get('utm_source')).toBe('rsideprojecttest');
    expect(parsed.searchParams.get('utm_campaign')).toBe('fall_launch_2026_');
  });

  it('falls back gracefully on invalid URL', () => {
    const raw = 'not-a-valid-url';
    const res = buildUTMUrl({ baseUrl: raw, source: 'test' });
    expect(res).toBe(raw);
  });
});

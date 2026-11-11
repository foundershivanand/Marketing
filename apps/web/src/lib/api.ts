export const API_BASE = '/api';

export async function fetchJson<T>(url: string, options?: RequestInit, retries = 2): Promise<T> {
  let attempt = 0;
  let lastError: any;

  while (attempt <= retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${API_BASE}${url}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        // Retry on 502/503/504
        if ((res.status === 502 || res.status === 503 || res.status === 504) && attempt < retries) {
          attempt++;
          await new Promise((r) => setTimeout(r, 600 * attempt));
          continue;
        }

        const errorText = await res.text();
        let parsed: any;
        try {
          parsed = JSON.parse(errorText);
        } catch {
          parsed = { error: errorText || `HTTP ${res.status}` };
        }
        throw new Error(parsed.error || parsed.message || `Request failed with ${res.status}`);
      }

      return res.json();
    } catch (err: any) {
      lastError = err;
      if (err.name === 'AbortError') {
        throw new Error(`Request timed out after 15s: ${url}`);
      }
      if (attempt < retries) {
        attempt++;
        await new Promise((r) => setTimeout(r, 500 * attempt));
        continue;
      }
      break;
    }
  }

  throw lastError;
}

export const api = {
  // Health
  getHealth: () => fetchJson<any>('/health'),

  // Products
  getProducts: () => fetchJson<any[]>('/products'),
  getProduct: (id: string) => fetchJson<any>(`/products/${id}`),
  createProduct: (data: any) => fetchJson<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => fetchJson<any>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Destinations
  getDestinations: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params || {}).toString();
    return fetchJson<any[]>(`/destinations${query ? `?${query}` : ''}`);
  },
  getDestinationStats: () => fetchJson<{ total: number; verified: number; restricted: number; unverified: number }>('/destinations/stats'),
  verifyDestination: (id: string) => fetchJson<any>(`/destinations/${id}/verify`, { method: 'POST' }),
  getDestinationThrottle: (id: string) => fetchJson<any>(`/destinations/${id}/throttle`),

  // Campaigns
  getCampaigns: (productId?: string) => {
    const query = productId ? `?product_id=${productId}` : '';
    return fetchJson<any[]>(`/campaigns${query}`);
  },
  getCampaign: (id: string) => fetchJson<any>(`/campaigns/${id}`),
  createCampaign: (data: any) => fetchJson<any>('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  startCampaign: (id: string) => fetchJson<any>(`/campaigns/${id}/start`, { method: 'POST' }),
  getCampaignResults: (id: string) => fetchJson<any>(`/campaigns/${id}/results`),

  // Submissions
  getSubmissions: (status?: string, page = 1, limit = 50) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', String(page));
    params.append('limit', String(limit));
    return fetchJson<any[]>(`/submissions?${params.toString()}`);
  },
  getTargetDetail: (id: string) => fetchJson<any>(`/submissions/targets/${id}`),
  executeTarget: (id: string) => fetchJson<any>(`/submissions/targets/${id}/execute`, { method: 'POST' }),
  retryTarget: (id: string) => fetchJson<any>(`/submissions/targets/${id}/retry`, { method: 'POST' }),
  interveneTarget: (id: string, data: any) => fetchJson<any>(`/submissions/targets/${id}/intervention`, { method: 'POST', body: JSON.stringify(data) }),

  // Dead Letter Queue (DLQ)
  getDLQ: (status = 'pending') => fetchJson<any[]>(`/submissions/dlq?status=${status}`),
  replayDLQ: (id: string) => fetchJson<any>(`/submissions/dlq/${id}/replay`, { method: 'POST' }),

  // Analytics
  getAnalytics: (productId: string) => fetchJson<any>(`/analytics/${productId}`),
  recordEvent: (data: any) => fetchJson<any>('/analytics/track', { method: 'POST', body: JSON.stringify(data) }),

  // Import
  importGitHub: (markdown?: string) => fetchJson<any>('/import/github', { method: 'POST', body: JSON.stringify({ markdown }) }),
};

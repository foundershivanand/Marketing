export const API_BASE = '/api';

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
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
}

export const api = {
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
  getSubmissions: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return fetchJson<any[]>(`/submissions${query}`);
  },
  executeTarget: (id: string) => fetchJson<any>(`/submissions/targets/${id}/execute`, { method: 'POST' }),
  retryTarget: (id: string) => fetchJson<any>(`/submissions/targets/${id}/retry`, { method: 'POST' }),
  interveneTarget: (id: string, data: any) => fetchJson<any>(`/submissions/targets/${id}/intervention`, { method: 'POST', body: JSON.stringify(data) }),

  // Analytics
  getAnalytics: (productId: string) => fetchJson<any>(`/analytics/${productId}`),
  recordEvent: (data: any) => fetchJson<any>('/analytics/track', { method: 'POST', body: JSON.stringify(data) }),

  // Import
  importGitHub: (markdown?: string) => fetchJson<any>('/import/github', { method: 'POST', body: JSON.stringify({ markdown }) }),
};

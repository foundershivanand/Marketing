import React, { useEffect, useState } from 'react';
import {
  ChartNoAxesCombined,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  Link as LinkIcon,
  Copy,
  Check,
} from 'lucide-react';
import { api } from '../lib/api';

export const Analytics: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Link generator tool
  const [generatorSlug, setGeneratorSlug] = useState('product-hunt');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const prods = await api.getProducts();
        setProducts(prods);
        if (prods.length > 0) {
          setSelectedProductId(prods[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (!selectedProductId) return;
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await api.getAnalytics(selectedProductId);
        setAnalyticsData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [selectedProductId]);

  const activeProduct = products.find((p) => p.id === selectedProductId);
  const generatedUtm = activeProduct
    ? `${activeProduct.website_url}?utm_source=${generatorSlug}&utm_medium=directory&utm_campaign=launchpilot&utm_content=listing`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUtm);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateClick = async () => {
    if (!selectedProductId) return;
    try {
      await api.recordEvent({
        productId: selectedProductId,
        eventType: 'visit',
        source: generatorSlug,
        metadata: { referrer: `https://${generatorSlug}.com` },
      });
      // Reload analytics
      const data = await api.getAnalytics(selectedProductId);
      setAnalyticsData(data);
      alert(`Recorded simulated visit event from ${generatorSlug}!`);
    } catch (e: any) {
      alert(`Error recording event: ${e.message}`);
    }
  };

  const handleSimulateConversion = async () => {
    if (!selectedProductId) return;
    try {
      await api.recordEvent({
        productId: selectedProductId,
        eventType: 'signup',
        source: generatorSlug,
        metadata: { plan: 'free' },
      });
      const data = await api.getAnalytics(selectedProductId);
      setAnalyticsData(data);
      alert(`Recorded simulated conversion event from ${generatorSlug}!`);
    } catch (e: any) {
      alert(`Error recording event: ${e.message}`);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ChartNoAxesCombined className="w-5 h-5 text-emerald-600" />
            <span>Growth & Attribution Analytics</span>
          </h2>
          <p className="text-xs text-slate-500">
            Determine which directories actually drive real visitors, signups, and customers via unique UTM tags.
          </p>
        </div>

        {/* Product Selector */}
        {products.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-600">Product:</span>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-800"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm">Loading growth analytics...</div>
      ) : !analyticsData ? (
        <div className="p-12 text-center text-slate-400">No analytics data available.</div>
      ) : (
        <div className="space-y-6">
          {/* AI Growth Summary Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 text-white border border-emerald-800/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Growth Analytics Agent Assessment</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {analyticsData.analysis?.summary}
            </p>
            {analyticsData.analysis?.key_insights && (
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {analyticsData.analysis.key_insights.map((insight: string, idx: number) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden space-y-3 p-6">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>Destination Performance & Recommendations</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Platform</th>
                    <th className="py-2.5 px-3">Qualified Traffic</th>
                    <th className="py-2.5 px-3">Conversions</th>
                    <th className="py-2.5 px-3">Conversion Rate</th>
                    <th className="py-2.5 px-3">AI Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analyticsData.analysis?.ranked_destinations?.map((dest: any, idx: number) => {
                    const convRate = dest.traffic > 0 ? Math.round((dest.conversions / dest.traffic) * 100) : 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-semibold text-slate-900">{dest.name}</td>
                        <td className="py-3 px-3 tabular-nums">{dest.traffic} visits</td>
                        <td className="py-3 px-3 tabular-nums font-medium text-emerald-700">{dest.conversions}</td>
                        <td className="py-3 px-3 tabular-nums">{convRate}%</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                              dest.recommendation === 'scale'
                                ? 'bg-emerald-100 text-emerald-800'
                                : dest.recommendation === 'maintain'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {dest.recommendation}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive UTM Generator & Simulator Tool */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-emerald-600" />
              <span>UTM Link Generator & Inbound Simulator</span>
            </h3>
            <p className="text-slate-500">
              Every destination gets an isolated UTM source to attribute visitors without tracking cookies.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                value={generatorSlug}
                onChange={(e) => setGeneratorSlug(e.target.value)}
                placeholder="slug (e.g. saashub, reddit-sideproject)"
                className="px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs w-full sm:w-64"
              />

              <div className="flex-1 w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 truncate">
                {generatedUtm}
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={handleSimulateClick}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium hover:bg-emerald-100"
              >
                + Simulate Inbound Visit
              </button>
              <button
                onClick={handleSimulateConversion}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-medium hover:bg-blue-100"
              >
                + Simulate Signup / Conversion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

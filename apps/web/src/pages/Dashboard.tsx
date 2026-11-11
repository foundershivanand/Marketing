import React, { useEffect, useState } from 'react';
import {
  Globe,
  CheckCircle2,
  Send,
  AlertCircle,
  ArrowRight,
  DownloadCloud,
  Plus,
  Play,
  Layers,
  Sparkles,
} from 'lucide-react';
import { api } from '../lib/api';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState({ total: 0, verified: 0, restricted: 0, unverified: 0 });
  const [products, setProducts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [destStats, prods, camps, subs] = await Promise.all([
        api.getDestinationStats(),
        api.getProducts(),
        api.getCampaigns(),
        api.getSubmissions(),
      ]);
      setStats(destStats);
      setProducts(prods);
      setCampaigns(camps);
      setSubmissions(subs);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImportGitHub = async () => {
    try {
      setImporting(true);
      const res = await api.importGitHub();
      alert(`Imported ${res.result.imported} destinations from PlacesToPostYourStartup!`);
      loadData();
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const successfulSubmissions = submissions.filter((s) => s.status === 'submitted' || s.status === 'approved').length;
  const pendingInterventions = submissions.filter((s) => s.status === 'manual_action_required').length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Startup Distribution Architecture</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Write Once. Distribute Everywhere. Measure Everything.
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            LaunchPilot deploys six specialized AI agents orchestrated by Cloudflare Workflows to research, adapt, and distribute your startup announcements across 290+ platforms without manual copy-pasting.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {stats.total === 0 && (
            <button
              onClick={handleImportGitHub}
              disabled={importing}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>{importing ? 'Importing...' : 'Import PlacesToPostYourStartup'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('products')}
            className="px-4 py-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-white font-medium text-sm flex items-center gap-2 border border-slate-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => onNavigate('campaigns')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <Play className="w-4 h-4" />
            <span>Launch Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Exact specification from blueprint section 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total destinations */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Destinations</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {loading ? '...' : stats.total > 0 ? stats.total : '100+'}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span>PlacesToPostYourStartup repo</span>
          </div>
        </div>

        {/* Card 2: Verified */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 tabular-nums">
            {loading ? '...' : stats.verified}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>Live database value</span>
            <span className="text-slate-400 font-mono text-[11px]">
              {stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}% verified
            </span>
          </div>
        </div>

        {/* Card 3: Successful submissions */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Successful Submissions</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {loading ? '...' : successfulSubmissions}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            <span>Live directory listings</span>
          </div>
        </div>

        {/* Card 4: Pending intervention */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Intervention</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 tabular-nums">
            {loading ? '...' : pendingInterventions}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            <span>Human review / CAPTCHA required</span>
          </div>
        </div>
      </div>

      {/* Grid: Active Products & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products column */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Startup Products
            </h3>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-3">
              <p className="text-sm">No products created yet.</p>
              <button
                onClick={() => onNavigate('products')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100"
              >
                Create your first startup profile
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-all"
                >
                  <div className="font-semibold text-slate-900 text-sm">{p.name}</div>
                  <div className="text-xs text-slate-500 truncate">{p.website_url}</div>
                  {p.tagline && <div className="text-xs text-slate-600 mt-1 italic">"{p.tagline}"</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submissions Activity column */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              Recent Distribution Activity
            </h3>
            <button
              onClick={() => onNavigate('submissions')}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All Submissions <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <p className="text-sm">No submissions executed yet.</p>
              <p className="text-xs text-slate-400">
                Create a campaign to automatically research and distribute your product.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {submissions.slice(0, 6).map((sub) => (
                <div key={sub.target_id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium text-slate-900 text-sm flex items-center gap-2">
                      <span>{sub.destination_name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {sub.destination_category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Product: <span className="text-slate-700 font-medium">{sub.product_name}</span> • Adapter: {sub.adapter_key || 'auto'}
                    </div>
                  </div>

                  <div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        sub.status === 'submitted' || sub.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : sub.status === 'manual_action_required'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : sub.status === 'failed'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {sub.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import {
  Megaphone,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  ArrowRight,
  Shield,
  Bot,
  X,
} from 'lucide-react';
import { api } from '../lib/api';

export const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCampaignDetail, setActiveCampaignDetail] = useState<any | null>(null);

  // Form state
  const [productId, setProductId] = useState('');
  const [name, setName] = useState('Product Launch Campaign');
  const [categories, setCategories] = useState<string[]>([
    'startup_directory',
    'product_directory',
    'launch_platform',
  ]);
  const [includePaid, setIncludePaid] = useState(false);
  const [includeReddit, setIncludeReddit] = useState(false);
  const [automation, setAutomation] = useState<'maximum' | 'approval_required'>('maximum');

  const [startingId, setStartingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [camps, prods] = await Promise.all([api.getCampaigns(), api.getProducts()]);
      setCampaigns(camps);
      setProducts(prods);
      if (prods.length > 0 && !productId) {
        setProductId(prods[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      alert('Please select or create a product first.');
      return;
    }

    try {
      const newCamp = await api.createCampaign({
        product_id: productId,
        name,
        settings: {
          categories,
          include_paid: includePaid,
          include_reddit: includeReddit,
          automation,
          tracking: true,
        },
      });

      setIsModalOpen(false);
      loadData();

      // Ask to start immediately
      if (confirm(`Campaign "${newCamp.name}" created! Would you like to run the autonomous distribution workflow now?`)) {
        handleStart(newCamp.id);
      }
    } catch (err: any) {
      alert(`Error creating campaign: ${err.message}`);
    }
  };

  const handleStart = async (campaignId: string) => {
    try {
      setStartingId(campaignId);
      const res = await api.startCampaign(campaignId);
      alert(
        `Distribution workflow executed!\nFound: ${res.destinations_found}\nEligible: ${res.eligible}\nHuman Review Required: ${res.requires_intervention}\nRestricted: ${res.restricted}`
      );
      loadData();
      handleViewResults(campaignId);
    } catch (err: any) {
      alert(`Failed to run campaign: ${err.message}`);
    } finally {
      setStartingId(null);
    }
  };

  const handleViewResults = async (campaignId: string) => {
    try {
      const detail = await api.getCampaignResults(campaignId);
      setActiveCampaignDetail(detail);
    } catch (err: any) {
      alert(`Error fetching results: ${err.message}`);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Distribution Campaigns</h2>
          <p className="text-xs text-slate-500">
            Generate and orchestrate multi-platform submission workflows with durable retries and policy enforcement.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Distribution Campaign</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No campaigns created yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Select a startup profile, pick destination categories, and let our agents generate and distribute tailored content packages.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs inline-flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Campaign</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((camp) => {
            const settings = JSON.parse(camp.settings_json || '{}');
            const isStarting = startingId === camp.id;

            return (
              <div
                key={camp.id}
                className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{camp.name}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Created {new Date(camp.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                        camp.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : camp.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : camp.status === 'generating'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {camp.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Settings pills */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                      Mode: {settings.automation || 'maximum'}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                      Paid: {settings.include_paid ? 'Included' : 'Excluded'}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                      Reddit: {settings.include_reddit ? 'Included' : 'Excluded'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleViewResults(camp.id)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                  >
                    View Status & Targets <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleStart(camp.id)}
                    disabled={isStarting}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isStarting ? 'Running Workflow...' : 'Execute Distribution'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-7 shadow-2xl border border-slate-200 my-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">New Distribution Campaign</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Startup Product *</label>
                <select
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.website_url})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campaign Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Initial Launch Wave"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-semibold text-slate-700">Automation Level (from blueprint decision)</label>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 cursor-pointer">
                    <input
                      type="radio"
                      name="automation"
                      checked={automation === 'maximum'}
                      onChange={() => setAutomation('maximum')}
                      className="mt-0.5 text-emerald-600"
                    />
                    <div>
                      <div className="font-semibold text-emerald-950">Maximum Automation (Recommended)</div>
                      <div className="text-[11px] text-emerald-800">
                        AI researches, writes, maps form fields and submits wherever officially supported. Human intervention only for CAPTCHAs, payments, and Reddit review.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                    <input
                      type="radio"
                      name="automation"
                      checked={automation === 'approval_required'}
                      onChange={() => setAutomation('approval_required')}
                      className="mt-0.5 text-slate-600"
                    />
                    <div>
                      <div className="font-semibold text-slate-800">Approval-Based Automation</div>
                      <div className="text-[11px] text-slate-500">
                        AI researches and generates tailored content, but halts and requires confirmation before any form submission.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeReddit}
                    onChange={(e) => setIncludeReddit(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-medium text-slate-700">Include Reddit Communities (Generates drafts for founder review)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePaid}
                    onChange={(e) => setIncludePaid(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-medium text-slate-700">Include Paid Directory Submissions (Requires approval before charge)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Results Drawer */}
      {activeCampaignDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl p-6 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Campaign Execution Targets</h3>
                <div className="text-xs text-slate-400">Campaign ID: {activeCampaignDetail.campaign_id}</div>
              </div>
              <button
                onClick={() => setActiveCampaignDetail(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-slate-400">Total</div>
                <div className="text-lg font-bold text-slate-900">{activeCampaignDetail.stats.total}</div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg">
                <div>Submitted</div>
                <div className="text-lg font-bold">{activeCampaignDetail.stats.submitted}</div>
              </div>
              <div className="p-3 bg-amber-50 text-amber-800 rounded-lg">
                <div>Review / Action</div>
                <div className="text-lg font-bold">{activeCampaignDetail.stats.manual_action_required}</div>
              </div>
              <div className="p-3 bg-red-50 text-red-800 rounded-lg">
                <div>Failed</div>
                <div className="text-lg font-bold">{activeCampaignDetail.stats.failed}</div>
              </div>
            </div>

            {/* Target List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Targets</h4>
              <div className="divide-y divide-slate-100 text-xs">
                {activeCampaignDetail.targets.map((tgt: any) => (
                  <div key={tgt.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800 font-mono text-[11px]">{tgt.destination_id}</div>
                      <div className="text-[11px] text-slate-400">
                        Adapter: {tgt.adapter_key || 'auto'} • Attempts: {tgt.attempts}
                      </div>
                      {tgt.error_message && (
                        <div className="text-[11px] text-amber-700 mt-0.5">{tgt.error_message}</div>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-medium text-[11px] bg-slate-100 text-slate-700">
                      {tgt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

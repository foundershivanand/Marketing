import React, { useEffect, useState } from 'react';
import {
  Globe,
  Search,
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  Bot,
  Filter,
  RefreshCw,
  X,
} from 'lucide-react';
import { api } from '../lib/api';

export const Destinations: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [policyFilter, setPolicyFilter] = useState('');

  // Selected for drawer
  const [selectedDestination, setSelectedDestination] = useState<any | null>(null);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;
      if (policyFilter) params.automation_policy = policyFilter;

      const data = await api.getDestinations(params);
      setDestinations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, [categoryFilter, statusFilter, policyFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDestinations();
  };

  const handleImport = async () => {
    try {
      setImporting(true);
      const res = await api.importGitHub();
      alert(`Import complete! ${res.result.imported} destinations processed from GitHub.`);
      loadDestinations();
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      setVerifyingId(id);
      const res = await api.verifyDestination(id);
      alert(`Verification completed for destination! Active: ${res.result.active}, Confidence: ${res.result.confidence}`);
      loadDestinations();
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`);
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Import */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Destination Catalogue (100+ Startup Platforms)</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {destinations.length} destinations
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Classified from <a href="https://github.com/mmccaff/PlacesToPostYourStartup" target="_blank" rel="noreferrer" className="underline hover:text-emerald-600">mmccaff/PlacesToPostYourStartup</a>.
          </p>
        </div>

        <button
          onClick={handleImport}
          disabled={importing}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
        >
          <DownloadCloud className="w-4 h-4" />
          <span>{importing ? 'Importing from GitHub...' : 'Sync GitHub README'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination name, slug, or domain..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-emerald-500 bg-slate-50/50"
            />
          </form>

          <div className="flex flex-wrap gap-2 text-xs">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="">All Categories</option>
              <option value="startup_directory">Startup Directory</option>
              <option value="product_directory">Product Directory</option>
              <option value="launch_platform">Launch Platform</option>
              <option value="reddit">Reddit Community</option>
              <option value="editorial">Editorial Pitch</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="">All Verification Statuses</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="restricted">Restricted</option>
              <option value="inactive">Inactive</option>
              <option value="paused">Paused</option>
            </select>

            <select
              value={policyFilter}
              onChange={(e) => setPolicyFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="">All Automation Policies</option>
              <option value="allowed">Allowed</option>
              <option value="requires_review">Requires Review</option>
              <option value="prohibited">Prohibited</option>
              <option value="unknown">Unknown</option>
            </select>

            <button
              onClick={() => { setSearch(''); setCategoryFilter(''); setStatusFilter(''); setPolicyFilter(''); loadDestinations(); }}
              className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Destinations Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading destinations catalogue...</div>
        ) : destinations.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-slate-500">No destinations found matching your filters.</p>
            <button
              onClick={handleImport}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium"
            >
              Import PlacesToPostYourStartup
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4">Automation Policy</th>
                  <th className="py-3 px-4">Method / Pricing</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {destinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedDestination(dest)}
                          className="hover:text-emerald-600 text-left"
                        >
                          {dest.name}
                        </button>
                        {dest.source_url && (
                          <a
                            href={dest.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-emerald-600"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                        {dest.submission_url || dest.source_url}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {dest.category.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[11px] ${
                          dest.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : dest.status === 'restricted'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : dest.status === 'inactive'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {dest.status === 'verified' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {dest.status === 'restricted' && <ShieldAlert className="w-3 h-3 text-rose-600" />}
                        {dest.status === 'unverified' && <HelpCircle className="w-3 h-3 text-amber-600" />}
                        {dest.status}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-mono font-medium ${
                          dest.automation_policy === 'allowed'
                            ? 'text-emerald-700'
                            : dest.automation_policy === 'requires_review'
                            ? 'text-amber-700'
                            : dest.automation_policy === 'prohibited'
                            ? 'text-rose-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {dest.automation_policy}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <div>Method: <span className="font-mono">{dest.submission_method}</span></div>
                      <div className="text-[11px] text-slate-400">Pricing: {dest.pricing_type}</div>
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleVerify(dest.id)}
                        disabled={verifyingId === dest.id}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-medium border border-slate-200 inline-flex items-center gap-1 transition-all"
                      >
                        <Bot className="w-3 h-3" />
                        <span>{verifyingId === dest.id ? 'Verifying...' : 'Verify with AI'}</span>
                      </button>

                      <button
                        onClick={() => setSelectedDestination(dest)}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-medium border border-slate-200"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Slide-over Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-end p-0">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 overflow-y-auto space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedDestination.name}</h3>
                  <div className="text-xs font-mono text-slate-400">{selectedDestination.slug}</div>
                </div>
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-700">Official URL:</span>
                  <a
                    href={selectedDestination.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-emerald-600 font-mono truncate"
                  >
                    {selectedDestination.source_url}
                  </a>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Submission URL:</span>
                  <a
                    href={selectedDestination.submission_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-emerald-600 font-mono truncate"
                  >
                    {selectedDestination.submission_url || 'Same as official URL'}
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>Category: <span className="font-semibold">{selectedDestination.category}</span></div>
                  <div>Status: <span className="font-semibold">{selectedDestination.status}</span></div>
                  <div>Policy: <span className="font-semibold">{selectedDestination.automation_policy}</span></div>
                  <div>Method: <span className="font-semibold">{selectedDestination.submission_method}</span></div>
                  <div>Confidence: <span className="font-semibold">{Math.round(selectedDestination.confidence * 100)}%</span></div>
                  <div>Adapter: <span className="font-mono">{selectedDestination.adapter_key || 'generic-form'}</span></div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Requirements & Limits:</span>
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg text-[11px] overflow-x-auto mt-1 font-mono">
                    {JSON.stringify(JSON.parse(selectedDestination.requirements_json || '{}'), null, 2)}
                  </pre>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Audit Evidence URLs:</span>
                  <pre className="p-3 bg-slate-100 text-slate-800 rounded-lg text-[11px] overflow-x-auto mt-1 font-mono">
                    {JSON.stringify(JSON.parse(selectedDestination.evidence_json || '[]'), null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => handleVerify(selectedDestination.id)}
                disabled={verifyingId === selectedDestination.id}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-500"
              >
                {verifyingId === selectedDestination.id ? 'Running AI Research...' : 'Trigger AI Research & Verification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

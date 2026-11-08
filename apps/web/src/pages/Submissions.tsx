import React, { useEffect, useState } from 'react';
import {
  Send,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Eye,
  ShieldAlert,
  X,
  Check,
} from 'lucide-react';
import { api } from '../lib/api';

export const Submissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [interventionModal, setInterventionModal] = useState<any | null>(null);

  // Intervention modal state
  const [manualUrl, setManualUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await api.getSubmissions(statusFilter);
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter]);

  const handleRetry = async (targetId: string) => {
    try {
      const res = await api.retryTarget(targetId);
      if (res.success) {
        alert('Submission executed successfully!');
      } else {
        alert(`Retry completed: ${res.errorMessage || 'Intervention needed'}`);
      }
      loadSubmissions();
    } catch (err: any) {
      alert(`Retry failed: ${err.message}`);
    }
  };

  const handleInterventionSubmit = async (action: 'approved' | 'manually_submitted' | 'rejected') => {
    if (!interventionModal) return;
    try {
      setSubmittingAction(true);
      await api.interveneTarget(interventionModal.target_id, {
        action,
        confirmation_url: manualUrl || undefined,
        notes,
      });
      alert(`Intervention recorded as: ${action}`);
      setInterventionModal(null);
      loadSubmissions();
    } catch (err: any) {
      alert(`Error recording intervention: ${err.message}`);
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Submission Execution & Audit Log</h2>
          <p className="text-xs text-slate-500">
            Real-time tracking of automated submissions, confirmation evidence, and pending human approvals.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-xs">
          {[
            { id: '', label: 'All' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'manual_action_required', label: 'Needs Intervention' },
            { id: 'failed', label: 'Failed' },
            { id: 'queued', label: 'Queued' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading submission logs...</div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No submissions recorded yet for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Product / Campaign</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Adapter / Attempts</th>
                  <th className="py-3 px-4">Confirmation / Evidence</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {submissions.slice((page - 1) * pageSize, page * pageSize).map((sub) => (
                  <tr key={sub.target_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{sub.destination_name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {sub.destination_category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Target: {sub.target_id}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{sub.product_name}</div>
                      <div className="text-[11px] text-slate-500">{sub.campaign_name}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[11px] ${
                          sub.status === 'submitted' || sub.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : sub.status === 'manual_action_required'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                            : sub.status === 'failed'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {sub.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <div>Adapter: <span className="font-mono">{sub.adapter_key || 'generic-form'}</span></div>
                      <div className="text-[11px] text-slate-400">Attempts: {sub.attempts}</div>
                    </td>

                    <td className="py-3 px-4">
                      {sub.submission_url ? (
                        <a
                          href={sub.submission_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 font-mono flex items-center gap-1 text-[11px] truncate max-w-xs"
                        >
                          <span>{sub.submission_url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          {sub.error_message || 'No confirmation URL yet'}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      {sub.status === 'manual_action_required' && (
                        <button
                          onClick={() => setInterventionModal(sub)}
                          className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-medium shadow-xs"
                        >
                          Review & Intervene
                        </button>
                      )}

                      {sub.status === 'failed' && (
                        <button
                          onClick={() => handleRetry(sub.target_id)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Retry</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-2 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-600 text-[11px] border border-slate-200"
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

        {/* Scalable Submissions Pagination Bar */}
        {submissions.length > pageSize && (
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 bg-slate-50/50">
            <div>
              Showing <span className="font-semibold text-slate-900">{(page - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-slate-900">{Math.min(page * pageSize, submissions.length)}</span> of{' '}
              <span className="font-semibold text-slate-900">{submissions.length}</span> targets
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-md bg-white border border-slate-200 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="px-2 font-mono text-slate-500">
                Page {page} of {Math.ceil(submissions.length / pageSize)}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(Math.ceil(submissions.length / pageSize), p + 1))}
                disabled={page >= Math.ceil(submissions.length / pageSize)}
                className="px-3 py-1.5 rounded-md bg-white border border-slate-200 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Human Intervention Modal */}
      {interventionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Human Review & Intervention Required</span>
              </div>
              <button onClick={() => setInterventionModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 space-y-1">
              <div className="font-semibold">Reason:</div>
              <div>{interventionModal.error_message || 'Automated flow paused for founder review.'}</div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-semibold text-slate-700">Destination:</span> {interventionModal.destination_name} ({interventionModal.destination_category})
              </div>
              <div>
                <span className="font-semibold text-slate-700">Product:</span> {interventionModal.product_name}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Manual Listing Confirmation URL (if you submitted manually)
                </label>
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://example.com/products/my-startup"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Notes / Verification Details</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. CAPTCHA passed, paid receipt #123, Reddit post flair selected..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleInterventionSubmit('rejected')}
                disabled={submittingAction}
                className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
              >
                Skip / Do Not Submit
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleInterventionSubmit('approved')}
                  disabled={submittingAction}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  Approve Automated Flow
                </button>

                <button
                  type="button"
                  onClick={() => handleInterventionSubmit('manually_submitted')}
                  disabled={submittingAction}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Mark as Manually Submitted
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Slide-over */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl p-6 overflow-y-auto space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedSubmission.destination_name}</h3>
                <div className="text-[11px] text-slate-400 font-mono">Target ID: {selectedSubmission.target_id}</div>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div><span className="font-semibold text-slate-700">Status:</span> {selectedSubmission.status}</div>
              <div><span className="font-semibold text-slate-700">Campaign:</span> {selectedSubmission.campaign_name}</div>
              <div><span className="font-semibold text-slate-700">Product:</span> {selectedSubmission.product_name}</div>
              <div><span className="font-semibold text-slate-700">Adapter:</span> {selectedSubmission.adapter_key}</div>
              <div><span className="font-semibold text-slate-700">Attempts:</span> {selectedSubmission.attempts}</div>
              <div><span className="font-semibold text-slate-700">External ID:</span> {selectedSubmission.external_submission_id || 'N/A'}</div>
              <div><span className="font-semibold text-slate-700">Submitted At:</span> {selectedSubmission.submitted_at || 'N/A'}</div>
            </div>

            {selectedSubmission.error_message && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-red-800">
                <span className="font-semibold">Error / Policy Note:</span>
                <div>{selectedSubmission.error_message}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

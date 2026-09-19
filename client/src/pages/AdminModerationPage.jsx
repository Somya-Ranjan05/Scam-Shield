// client/src/pages/AdminModerationPage.jsx
import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { api } from "../lib/apiClient";
import { useAuth } from "../context/AuthContext";
import AdminReportRow from "../components/admin/AdminReportRow";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import EmptyState from "../components/shared/EmptyState";
import ErrorBanner from "../components/shared/ErrorBanner";

export default function AdminModerationPage() {
  const { token, user } = useAuth();
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const loadPendingReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPendingReports({ limit: 50 }, token);
      setReports(res.reports || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load moderation queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadPendingReports();
    }
  }, [token]);

  const handleUpdateStatus = async (reportId, newStatus) => {
    setError(null);
    try {
      await api.updateReportStatus(reportId, newStatus, token);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setTotal((prev) => Math.max(0, prev - 1));
      setActionSuccess(`Report ${reportId.slice(0, 8)} updated to "${newStatus.replace(/_/g, " ")}" successfully.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      setError(err.message || "Failed to update report status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider border border-amber-500/20 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Role-Gated Security Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Threat Intelligence Moderation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review citizen-submitted scam reports before publication to the National Threat Registry.
          </p>
        </div>

        <button
          onClick={loadPendingReports}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Queue ({total})</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="rounded-xl bg-emerald-950/40 border border-emerald-800/60 p-4 text-emerald-200 flex items-center space-x-3 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Queue Content */}
      {loading ? (
        <LoadingSpinner text="Loading Moderation Queue..." />
      ) : reports.length === 0 ? (
        <EmptyState
          title="Moderation Queue is Clean"
          description="All submitted community threat reports have been reviewed and classified."
          actionText="View Public Registry"
          actionLink="/registry"
          icon={ShieldCheck}
        />
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pending Review ({reports.length})
          </div>
          {reports.map((report) => (
            <AdminReportRow
              key={report.id}
              report={report}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

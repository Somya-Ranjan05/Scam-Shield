// client/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, FileSearch, ShieldCheck, ShieldAlert, Filter, ArrowRight } from "lucide-react";
import { api } from "../lib/apiClient";
import { useAuth } from "../context/AuthContext";
import DashboardHistoryTable from "../components/dashboard/DashboardHistoryTable";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import EmptyState from "../components/shared/EmptyState";
import ErrorBanner from "../components/shared/ErrorBanner";

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [riskTier, setRiskTier] = useState("");
  const [submissionType, setSubmissionType] = useState("");

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDashboardHistory(
        {
          riskTier: riskTier || undefined,
          submissionType: submissionType || undefined,
          limit: 50,
        },
        token
      );
      setHistory(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load scan history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadHistory();
    }
  }, [token, riskTier, submissionType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold uppercase tracking-wider border border-brand-500/20 mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Personal Security Log</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Scan History & Threat Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Logged in as <span className="text-slate-200 font-medium">{user?.email}</span>
          </p>
        </div>

        <Link
          to="/check"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all"
        >
          <FileSearch className="w-4 h-4" />
          <span>New Fraud Scan</span>
        </Link>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-400">
          <Filter className="w-4 h-4 text-brand-400" />
          <span className="font-semibold uppercase tracking-wider">Filter History</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Risk Tier Filter */}
          <select
            value={riskTier}
            onChange={(e) => setRiskTier(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Risk Tiers</option>
            <option value="safe">Safe / Low Risk</option>
            <option value="suspicious">Suspicious</option>
            <option value="dangerous">Dangerous</option>
            <option value="confirmed_scam">Confirmed Scam</option>
          </select>

          {/* Submission Type Filter */}
          <select
            value={submissionType}
            onChange={(e) => setSubmissionType(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Input Types</option>
            <option value="text">Text / SMS</option>
            <option value="link">URL / Link</option>
            <option value="qr_code">QR Code Image</option>
            <option value="voice">Voice Note</option>
            <option value="apk">APK File</option>
          </select>
        </div>
      </div>

      {/* History Table or Empty State */}
      {loading ? (
        <LoadingSpinner text="Loading Your Personal Scan Records..." />
      ) : history.length === 0 ? (
        <EmptyState
          title="No scan history found"
          description={
            riskTier || submissionType
              ? "No scan records match the selected filter criteria."
              : "You haven't scanned any messages or links yet. Start by checking a suspicious message."
          }
          actionText="Run Your First Scan"
          actionLink="/check"
        />
      ) : (
        <DashboardHistoryTable items={history} />
      )}
    </div>
  );
}

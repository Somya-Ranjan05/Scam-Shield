// client/src/pages/RegistryDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Users, Calendar, CheckCircle, Share2, Check, AlertTriangle, FileText } from "lucide-react";
import { api } from "../lib/apiClient";
import { useAuth } from "../context/AuthContext";
import RiskTierBadge from "../components/result/RiskTierBadge";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorBanner from "../components/shared/ErrorBanner";

export default function RegistryDetailPage() {
  const { reportId } = useParams();
  const { token } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getRegistryReportById(reportId, token);
        setReport(data);
      } catch (err) {
        setError(err.message || "Failed to load report details.");
      } finally {
        setLoading(false);
      }
    }

    if (reportId) {
      loadReport();
    }
  }, [reportId, token]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner text="Loading Threat Report Detail..." />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-4">
        <ErrorBanner message={error || "Threat report record not found."} />
        <Link
          to="/registry"
          className="inline-flex items-center space-x-2 text-sm text-brand-400 hover:text-brand-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Threat Registry</span>
        </Link>
      </div>
    );
  }

  const isVerified = report.status === "admin_verified" || report.status === "community_verified";
  const dateFormatted = new Date(report.created_at).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Back button and Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/registry"
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Threat Registry</span>
        </Link>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Share Threat Report</span>
            </>
          )}
        </button>
      </div>

      {/* Main Detail Card */}
      <div className="rounded-3xl glass-panel-glow bg-slateDark-900/90 border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider border border-slate-700">
                {report.scam_category?.replace(/_/g, " ")}
              </span>
              {report.status === "admin_verified" ? (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Admin Verified</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold uppercase border border-blue-500/30 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Community Verified</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Threat Intelligence Dossier
            </h1>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs uppercase font-semibold text-slate-400">Total Reports Logged</div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono">
              {report.report_count || 1}
            </div>
          </div>
        </div>

        {/* Threat Signature Box */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Flagged Threat Signature (Domain, Phone Number, or Package)
          </div>
          <code className="text-base sm:text-lg font-mono font-bold text-amber-300 break-all block">
            {report.threat_signature}
          </code>
        </div>

        {/* Public Summary */}
        <div className="space-y-2 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Sanitized Public Summary & Pattern Breakdown
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            {report.public_summary}
          </p>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
            <span className="text-slate-400">First Recorded Date</span>
            <div className="text-slate-200 font-semibold">{dateFormatted}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
            <span className="text-slate-400">Report Status</span>
            <div className="text-slate-200 font-semibold uppercase">{report.status.replace(/_/g, " ")}</div>
          </div>
        </div>

        {/* Safety Warning */}
        <div className="p-4 rounded-2xl bg-red-950/30 border border-red-900/50 flex items-start space-x-3 text-xs text-red-200">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Do not engage, click links, call back numbers, or install APK files associated with this signature. If you have already suffered financial loss, contact your bank and report to the National Cybercrime Portal immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

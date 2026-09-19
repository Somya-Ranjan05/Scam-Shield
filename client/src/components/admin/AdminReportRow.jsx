// client/src/components/admin/AdminReportRow.jsx
import React, { useState } from "react";
import { Check, X, ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminReportRow({ report, onUpdateStatus }) {
  const [processing, setProcessing] = useState(false);

  const handleAction = async (newStatus) => {
    setProcessing(true);
    try {
      await onUpdateStatus(report.id, newStatus);
    } finally {
      setProcessing(false);
    }
  };

  const date = new Date(report.created_at).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl glass-panel border border-slate-800 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase border border-amber-500/30">
            Pending Moderation
          </span>
          <span className="text-xs text-slate-400">Reported on {date}</span>
        </div>
        <div className="text-xs font-semibold text-slate-300">
          Reports Count: <span className="text-white font-mono">{report.report_count || 1}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Threat Signature */}
        <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Threat Signature
          </span>
          <code className="text-amber-300 font-mono text-sm break-all font-semibold">
            {report.threat_signature}
          </code>
        </div>

        {/* Category */}
        <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Scam Classification
          </span>
          <div className="text-slate-200 font-semibold uppercase">
            {report.scam_category?.replace(/_/g, " ")}
          </div>
          {report.other_category_note && (
            <div className="text-slate-400 text-[11px] mt-1">{report.other_category_note}</div>
          )}
        </div>

        {/* Submission Link */}
        <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Scan Submission
          </span>
          <Link
            to={`/result/${report.submission_id}`}
            target="_blank"
            className="text-brand-400 hover:text-brand-300 flex items-center space-x-1 font-medium mt-1"
          >
            <span>View Full AI Scan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
          Sanitized Public Summary
        </span>
        {report.public_summary}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
        <button
          onClick={() => handleAction("rejected")}
          disabled={processing}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-700/60 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
        >
          <X className="w-3.5 h-3.5 text-red-400" />
          <span>Reject / False Positive</span>
        </button>

        <button
          onClick={() => handleAction("community_verified")}
          disabled={processing}
          className="px-3.5 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-700/60 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
        >
          <Check className="w-3.5 h-3.5 text-blue-400" />
          <span>Verify as Community Report</span>
        </button>

        <button
          onClick={() => handleAction("admin_verified")}
          disabled={processing}
          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-950/50 transition-colors disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Approve & Verify (Admin Verified)</span>
        </button>
      </div>
    </div>
  );
}

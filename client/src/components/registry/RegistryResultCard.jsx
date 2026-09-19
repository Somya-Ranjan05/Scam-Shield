// client/src/components/registry/RegistryResultCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Users, Calendar, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";
import RiskTierBadge from "../result/RiskTierBadge";

export default function RegistryResultCard({ report }) {
  const isCommunityVerified = report.status === "community_verified";
  const isAdminVerified = report.status === "admin_verified";

  const dateFormatted = report.created_at
    ? new Date(report.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently reported";

  return (
    <div className="rounded-2xl glass-panel border border-slate-800 hover:border-brand-500/40 p-5 flex flex-col justify-between space-y-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-950/20 group">
      {/* Top Meta */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {report.scam_category?.replace(/_/g, " ")}
          </span>

          {isAdminVerified ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Admin Verified</span>
            </span>
          ) : isCommunityVerified ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Community Verified</span>
            </span>
          ) : null}
        </div>

        {/* Threat Signature */}
        <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Flagged Threat Signature
          </div>
          <div className="text-sm font-mono font-semibold text-amber-300 truncate mt-0.5">
            {report.threat_signature || "Scam Pattern Signature"}
          </div>
        </div>

        {/* Public Summary */}
        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
          {report.public_summary}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{report.report_count || 1} report{report.report_count > 1 ? "s" : ""}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{dateFormatted}</span>
          </span>
        </div>

        <Link
          to={`/registry/${report.id}`}
          className="text-brand-400 hover:text-brand-300 font-medium flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

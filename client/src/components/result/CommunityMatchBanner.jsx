// client/src/components/result/CommunityMatchBanner.jsx
import React from "react";
import { Users, ShieldAlert, AlertOctagon } from "lucide-react";

export default function CommunityMatchBanner({ match }) {
  if (!match || !match.total_reports) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-red-950/60 via-amber-950/40 to-slate-900 border border-red-500/40 p-4 sm:p-5 shadow-xl shadow-red-950/20 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
          <Users className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-red-300">
              High-Confidence Threat Signature
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-extrabold uppercase border border-red-500/30">
              Community Alert
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            <strong className="text-white font-semibold">{match.total_reports} other users</strong> have independently flagged matching indicators for this threat signature (
            <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded text-[11px] font-mono">
              {match.signature}
            </code>
            ).
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-red-400">Risk Boost Applied</div>
        <div className="text-sm font-bold text-slate-100">+25% Match Elevate</div>
      </div>
    </div>
  );
}

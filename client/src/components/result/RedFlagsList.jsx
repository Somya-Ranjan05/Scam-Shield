// client/src/components/result/RedFlagsList.jsx
import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function RedFlagsList({ redFlags = [], isSafe = false }) {
  if (!redFlags || redFlags.length === 0) {
    return (
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 text-xs text-slate-400">
        No specific technical red flags identified in submitted payload.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
        <AlertCircle className={`w-3.5 h-3.5 ${isSafe ? "text-emerald-400" : "text-amber-400"}`} />
        <span>Identified Red Flags & Anomaly Indicators ({redFlags.length})</span>
      </h4>
      <div className="space-y-2">
        {redFlags.map((flag, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed ${
              isSafe
                ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-200"
                : "bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700 transition-colors"
            }`}
          >
            {isSafe ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                {idx + 1}
              </span>
            )}
            <div className="flex-1">{flag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

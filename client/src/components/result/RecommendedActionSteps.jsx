// client/src/components/result/RecommendedActionSteps.jsx
import React from "react";
import { ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";

export default function RecommendedActionSteps({ actions = [] }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
        <span>Recommended Safe Next Steps</span>
      </h4>
      <div className="space-y-2.5">
        {actions.map((action, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-brand-950/20 border border-brand-900/40 text-slate-100 flex items-start space-x-3.5 text-xs sm:text-sm leading-relaxed"
          >
            <div className="w-6 h-6 rounded-lg bg-brand-500/20 border border-brand-500/40 text-brand-300 font-bold flex items-center justify-center shrink-0 text-xs">
              {idx + 1}
            </div>
            <div className="flex-1 pt-0.5">{action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

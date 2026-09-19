// client/src/components/shared/LoadingSpinner.jsx
import React from "react";
import { Shield } from "lucide-react";

export default function LoadingSpinner({ text = "Analyzing threat indicators with ScamShield AI...", subtext = "Checking against multi-modal models and community threat registry" }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing spinner ring */}
        <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin"></div>
        {/* Inner static shield icon */}
        <div className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/30">
          <Shield className="w-6 h-6 text-brand-400 animate-pulse" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-100">{text}</h3>
        {subtext && <p className="text-xs text-slate-400 max-w-sm">{subtext}</p>}
      </div>
    </div>
  );
}

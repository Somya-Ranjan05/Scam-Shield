// client/src/components/result/RiskTierBadge.jsx
import React from "react";
import { ShieldCheck, AlertTriangle, ShieldAlert, Skull } from "lucide-react";

export default function RiskTierBadge({ tier = "safe", size = "md" }) {
  const configs = {
    safe: {
      label: "Safe / Low Risk",
      icon: ShieldCheck,
      classes: "bg-emerald-950/60 text-emerald-400 border-emerald-500/40 shadow-emerald-950/40",
    },
    suspicious: {
      label: "Suspicious Activity",
      icon: AlertTriangle,
      classes: "bg-amber-950/60 text-amber-400 border-amber-500/40 shadow-amber-950/40",
    },
    dangerous: {
      label: "Dangerous Threat",
      icon: ShieldAlert,
      classes: "bg-orange-950/60 text-orange-400 border-orange-500/40 shadow-orange-950/40",
    },
    confirmed_scam: {
      label: "Confirmed Scam Pattern",
      icon: Skull,
      classes: "bg-red-950/70 text-red-400 border-red-500/50 shadow-red-950/60 animate-pulse",
    },
  };

  const current = configs[tier] || configs.safe;
  const Icon = current.icon;

  const sizeClasses = size === "lg" 
    ? "px-4 py-2 text-sm space-x-2 rounded-xl"
    : size === "sm"
    ? "px-2.5 py-1 text-xs space-x-1.5 rounded-lg"
    : "px-3.5 py-1.5 text-xs font-semibold space-x-2 rounded-xl";

  return (
    <span
      className={`inline-flex items-center border shadow-md font-semibold uppercase tracking-wider ${sizeClasses} ${current.classes}`}
    >
      <Icon className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      <span>{current.label}</span>
    </span>
  );
}

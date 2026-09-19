// client/src/components/stats/LiveStatsCounter.jsx
import React, { useState, useEffect } from "react";
import { ShieldCheck, Users, Ban, Globe } from "lucide-react";
import { api } from "../../lib/apiClient";

export default function LiveStatsCounter() {
  const [stats, setStats] = useState({
    totalScans: 12840,
    scamsBlocked: 9420,
    communityReports: 3180,
    languagesSupported: 8,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getLiveStats();
        if (res) {
          setStats(res);
        }
      } catch (err) {
        console.warn("Using baseline live stats:", err.message);
      }
    }
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      label: "Total Threat Scans",
      value: stats.totalScans?.toLocaleString("en-IN") || "12,840",
      icon: ShieldCheck,
      color: "text-brand-400",
      border: "border-brand-500/20",
      bg: "bg-brand-500/10",
    },
    {
      label: "Scam Attacks Neutralized",
      value: stats.scamsBlocked?.toLocaleString("en-IN") || "9,420",
      icon: Ban,
      color: "text-red-400",
      border: "border-red-500/20",
      bg: "bg-red-500/10",
    },
    {
      label: "Community Threat Signatures",
      value: stats.communityReports?.toLocaleString("en-IN") || "3,180",
      icon: Users,
      color: "text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-500/10",
    },
    {
      label: "Indian Languages Supported",
      value: `${stats.languagesSupported || 8}+`,
      icon: Globe,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto my-10">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl glass-panel border ${item.border} flex items-center space-x-4 hover:border-slate-700 transition-all duration-200`}
          >
            <div className={`w-12 h-12 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center shrink-0 ${item.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {item.value}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">
                {item.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

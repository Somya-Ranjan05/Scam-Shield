// client/src/components/dashboard/DashboardHistoryTable.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Calendar, MessageSquare, Link2, QrCode, Mic, Smartphone } from "lucide-react";
import RiskTierBadge from "../result/RiskTierBadge";

export default function DashboardHistoryTable({ items = [] }) {
  if (!items || items.length === 0) {
    return null;
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "text":
        return <MessageSquare className="w-4 h-4 text-brand-400" />;
      case "link":
        return <Link2 className="w-4 h-4 text-cyan-400" />;
      case "qr_code":
        return <QrCode className="w-4 h-4 text-emerald-400" />;
      case "voice":
        return <Mic className="w-4 h-4 text-purple-400" />;
      case "apk":
        return <Smartphone className="w-4 h-4 text-amber-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-800">
          <tr>
            <th className="px-5 py-3.5">Type & Artifact</th>
            <th className="px-5 py-3.5">Risk Tier</th>
            <th className="px-5 py-3.5">Score</th>
            <th className="px-5 py-3.5">Scam Category</th>
            <th className="px-5 py-3.5">Date</th>
            <th className="px-5 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {items.map((item) => {
            const verdict = Array.isArray(item.verdicts) ? item.verdicts[0] : item.verdicts || item.verdict;
            const score = verdict?.risk_score ?? 0;
            const tier = verdict?.risk_tier || "safe";
            const category = verdict?.scam_category || "other";

            let label = item.raw_text || item.raw_url || item.qr_decoded_payload || item.transcribed_text || item.apk_filename || "Submission Content";
            if (label.length > 50) label = label.slice(0, 50) + "...";

            const date = new Date(item.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                {/* Type & Preview */}
                <td className="px-5 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                      {getTypeIcon(item.submission_type)}
                    </div>
                    <div className="min-w-0 max-w-xs">
                      <div className="text-xs uppercase font-bold text-slate-400">
                        {item.submission_type?.replace(/_/g, " ")}
                      </div>
                      <div className="text-xs text-slate-200 truncate font-mono mt-0.5">
                        {label}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Tier */}
                <td className="px-5 py-4">
                  <RiskTierBadge tier={tier} size="sm" />
                </td>

                {/* Score */}
                <td className="px-5 py-4">
                  <span className="font-extrabold text-white text-base">
                    {score}
                    <span className="text-[10px] text-slate-500 font-normal">/100</span>
                  </span>
                </td>

                {/* Category */}
                <td className="px-5 py-4 text-xs font-medium text-slate-300">
                  {category.replace(/_/g, " ").toUpperCase()}
                </td>

                {/* Date */}
                <td className="px-5 py-4 text-xs text-slate-400">
                  {date}
                </td>

                {/* Action Link */}
                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/result/${item.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 px-3 py-1.5 rounded-lg border border-brand-500/20 transition-colors"
                  >
                    <span>Verdict</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

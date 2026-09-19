// client/src/components/shared/EmptyState.jsx
import React from "react";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({
  title = "No threat records found",
  description = "No items match your search or filter criteria.",
  actionText = "Check a Message Now",
  actionLink = "/check",
  icon: Icon = ShieldAlert,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl glass-panel border border-dashed border-slate-800 my-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-400">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mt-1 mb-6">{description}</p>
      {actionLink && actionText && (
        <Link
          to={actionLink}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

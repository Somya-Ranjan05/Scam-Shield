// client/src/components/registry/RegistryPagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RegistryPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900/80 rounded-xl border border-slate-800">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

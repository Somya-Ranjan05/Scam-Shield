// client/src/components/shared/ErrorBanner.jsx
import React from "react";
import { AlertCircle, X } from "lucide-react";

export default function ErrorBanner({ message, onDismiss, code }) {
  if (!message) return null;

  return (
    <div className="rounded-xl bg-red-950/40 border border-red-800/60 p-4 text-red-200 flex items-start space-x-3 shadow-lg shadow-red-950/30">
      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        <div className="font-semibold text-red-300">
          {code ? `Error (${code})` : "Scan Request Error"}
        </div>
        <div className="text-red-200/90 mt-0.5">{message}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-200 p-1 rounded-md hover:bg-red-900/50"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

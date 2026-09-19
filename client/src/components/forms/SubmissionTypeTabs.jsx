// client/src/components/forms/SubmissionTypeTabs.jsx
import React from "react";
import { MessageSquare, Link2, QrCode, Mic, Smartphone } from "lucide-react";

export const SUBMISSION_TYPES = [
  { id: "text", label: "Text / SMS / WhatsApp", icon: MessageSquare, badge: "Most Common" },
  { id: "link", label: "Website Link / URL", icon: Link2 },
  { id: "qr", label: "QR Code Image", icon: QrCode },
  { id: "voice", label: "Voice Note / Audio", icon: Mic },
  { id: "apk", label: "Android APK Name", icon: Smartphone },
];

export default function SubmissionTypeTabs({ activeType, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 bg-slateDark-900/90 rounded-2xl border border-white/5 mb-6">
      {SUBMISSION_TYPES.map((type) => {
        const Icon = type.icon;
        const isActive = activeType === type.id;
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={`relative flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25 border border-brand-400/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
            <span className="truncate">{type.label}</span>
          </button>
        );
      })}
    </div>
  );
}

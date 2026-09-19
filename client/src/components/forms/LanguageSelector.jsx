// client/src/components/forms/LanguageSelector.jsx
import React from "react";
import { Globe } from "lucide-react";

export const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "mr", name: "Marathi", native: "मराठी" },
];

export default function LanguageSelector({ value, onChange, label = "AI Explanation Language" }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <Globe className="w-3.5 h-3.5 text-brand-400" />
          <span>{label}</span>
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-900/90 text-slate-100 border border-slate-700/70 rounded-xl px-3.5 py-2.5 text-sm appearance-none focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer transition-colors"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
              {lang.native} ({lang.name})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

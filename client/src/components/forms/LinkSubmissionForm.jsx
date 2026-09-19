// client/src/components/forms/LinkSubmissionForm.jsx
import React, { useState } from "react";
import { Link2, HelpCircle, ShieldCheck, Sparkles } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

const SAMPLE_LINKS = [
  { label: "Spoofed Bank", url: "https://sbi-kyc-verification-portal-update.online/login" },
  { label: "Fake Reward", url: "http://free-recharge-offer-jio-airtel.xyz/claim?id=9928" },
  { label: "Suspicious Shortlink", url: "https://bit.ly/sbi-pan-update-immediate" },
];

export default function LinkSubmissionForm({ onSubmit, loading }) {
  const [url, setUrl] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit({
      url: url.trim(),
      additional_context: additionalContext.trim() || undefined,
      preferred_language: preferredLanguage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Sample presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Try a suspicious link sample:</span>
        </span>
        {SAMPLE_LINKS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setUrl(s.url)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* URL Field */}
      <div className="space-y-1.5">
        <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <Link2 className="w-3.5 h-3.5 text-brand-400" />
          <span>Website URL or Shortlink *</span>
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://suspicious-website-login.com/kyc"
          className="w-full glass-input rounded-xl px-3.5 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <p className="text-[11px] text-slate-400">
          We safely inspect domain age, typosquatting indicators, redirect hops, and phishing patterns without triggering malicious payload execution.
        </p>
      </div>

      {/* Language Selector & Additional Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LanguageSelector value={preferredLanguage} onChange={setPreferredLanguage} />

        <div className="space-y-1.5">
          <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
            <span>Additional Context (Optional)</span>
          </label>
          <input
            type="text"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="e.g. Sent via SMS claiming my electricity bill is unpaid"
            maxLength={1000}
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <ShieldCheck className="w-5 h-5" />
        <span>{loading ? "Analyzing Domain Reputation..." : "Scan URL for Phishing"}</span>
      </button>
    </form>
  );
}

// client/src/components/forms/ApkSubmissionForm.jsx
import React, { useState } from "react";
import { Smartphone, HelpCircle, ShieldCheck, Sparkles, FileCode, Link as LinkIcon } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

const SAMPLE_APKS = [
  {
    label: "Fake SBI KYC APK",
    filename: "SBI-KYC-Update-v2.1.apk",
    pkg: "com.fake.sbi.kyc",
    source: "https://whatsapp-shared-download.net/sbi.apk",
  },
  {
    label: "Remote Access Rat",
    filename: "BankCustomerSupportQuick.apk",
    pkg: "com.device.remote.support",
    source: "http://customer-care-helpdesk.in/app.apk",
  },
  {
    label: "Fake Loan App",
    filename: "Instant-Cash-5Min-Loan.apk",
    pkg: "com.quickloan.fastmoney",
    source: "http://fastloans-india-direct.top",
  },
];

export default function ApkSubmissionForm({ onSubmit, loading }) {
  const [apkFilename, setApkFilename] = useState("");
  const [packageName, setPackageName] = useState("");
  const [sourceLink, setSourceLink] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apkFilename.trim()) return;
    onSubmit({
      apk_filename: apkFilename.trim(),
      package_name: packageName.trim() || undefined,
      source_link: sourceLink.trim() || undefined,
      additional_context: additionalContext.trim() || undefined,
      preferred_language: preferredLanguage,
    });
  };

  const loadSample = (sample) => {
    setApkFilename(sample.filename);
    setPackageName(sample.pkg);
    setSourceLink(sample.source);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Sample presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Try a known malicious APK sample:</span>
        </span>
        {SAMPLE_APKS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => loadSample(s)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* APK Filename Field */}
      <div className="space-y-1.5">
        <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <Smartphone className="w-3.5 h-3.5 text-brand-400" />
          <span>APK Filename / Application Name *</span>
        </label>
        <input
          type="text"
          value={apkFilename}
          onChange={(e) => setApkFilename(e.target.value)}
          required
          placeholder="e.g. SBI-KYC-Verification.apk, AnyDesk-Support.apk"
          className="w-full glass-input rounded-xl px-3.5 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <p className="text-[11px] text-slate-400">
          Scammers commonly send sideloaded APKs on WhatsApp disguised as banking or electricity apps to install remote control RATs (e.g. SMS forwarding / accessibility permissions).
        </p>
      </div>

      {/* Package Name & Source Link in Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <FileCode className="w-3.5 h-3.5 text-brand-400" />
            <span>Package Name (Optional)</span>
          </label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            placeholder="e.g. com.fake.sbi.kyc, org.rat.support"
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <LinkIcon className="w-3.5 h-3.5 text-brand-400" />
            <span>Download Source URL (Optional)</span>
          </label>
          <input
            type="url"
            value={sourceLink}
            onChange={(e) => setSourceLink(e.target.value)}
            placeholder="https://t.me/download/app.apk"
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
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
            placeholder="e.g. Asked me to install and give accessibility permissions"
            maxLength={1000}
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !apkFilename.trim()}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <ShieldCheck className="w-5 h-5" />
        <span>{loading ? "Analyzing APK Threat Patterns..." : "Scan APK for Malware Signatures"}</span>
      </button>
    </form>
  );
}

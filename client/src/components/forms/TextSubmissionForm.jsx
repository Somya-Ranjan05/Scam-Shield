// client/src/components/forms/TextSubmissionForm.jsx
import React, { useState } from "react";
import { MessageSquare, Phone, HelpCircle, ShieldCheck, Sparkles } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

const SAMPLE_MESSAGES = [
  {
    label: "Fake Bank KYC",
    text: "Dear SBI Customer, Your YONO account has been suspended due to pending PAN/KYC update. Please click http://sbi-kyc-update.com immediately to update your documents or your account will be permanently blocked.",
    sender: "+919876543210",
  },
  {
    label: "Lottery / Prize",
    text: "CONGRATULATIONS! You have won Rs 25,00,000 in KBC Kaun Banega Crorepati WhatsApp Lucky Draw! To claim your prize money, contact WhatsApp manager Mr. Rana on +918765432109 and pay registration fee Rs 1,500.",
    sender: "KBC-LUCKY",
  },
  {
    label: "Part-Time Job",
    text: "Hi! We have a work from home job for you. Just like YouTube videos and earn Rs 3,000 to 5,000 daily! Daily payout to UPI. Join our Telegram channel t.me/fast_money_india now to start.",
    sender: "+917890123456",
  },
];

export default function TextSubmissionForm({ onSubmit, loading }) {
  const [messageBody, setMessageBody] = useState("");
  const [senderId, setSenderId] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) return;
    onSubmit({
      message_body: messageBody.trim(),
      sender_id: senderId.trim() || undefined,
      additional_context: additionalContext.trim() || undefined,
      preferred_language: preferredLanguage,
    });
  };

  const loadSample = (sample) => {
    setMessageBody(sample.text);
    setSenderId(sample.sender);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Sample presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Try a real scam sample:</span>
        </span>
        {SAMPLE_MESSAGES.map((s, idx) => (
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

      {/* Message Body Field */}
      <div className="space-y-1.5">
        <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300">
          <span className="flex items-center space-x-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
            <span>Message Content / SMS / WhatsApp Text *</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            {messageBody.length}/5000 characters
          </span>
        </label>
        <textarea
          rows={5}
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          maxLength={5000}
          required
          placeholder="Paste the exact SMS, WhatsApp message, email, or telegram chat text here..."
          className="w-full glass-input rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Sender Identifier Field */}
      <div className="space-y-1.5">
        <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <Phone className="w-3.5 h-3.5 text-brand-400" />
          <span>Sender Phone Number or Header (Optional)</span>
        </label>
        <input
          type="text"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          placeholder="e.g. +91 98765 43210, AX-SBIBNK, JD-LOTTO"
          maxLength={100}
          className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Language Selector & Additional Context in Grid */}
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
            placeholder="e.g. Received at 2 AM, I clicked but didn't enter OTP"
            maxLength={1000}
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !messageBody.trim()}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <ShieldCheck className="w-5 h-5" />
        <span>{loading ? "Analyzing Fraud Risk..." : "Scan Message for Fraud"}</span>
      </button>
    </form>
  );
}

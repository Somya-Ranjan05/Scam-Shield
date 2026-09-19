// client/src/components/result/ReportScamModal.jsx
import React, { useState } from "react";
import { ShieldAlert, X, AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { api } from "../../lib/apiClient";
import { useAuth } from "../../context/AuthContext";
import ErrorBanner from "../shared/ErrorBanner";

const SCAM_CATEGORIES = [
  { id: "phishing_link", label: "Phishing Link / Fake Login URL" },
  { id: "fake_banking_upi", label: "Fake Banking / UPI OTP Request" },
  { id: "lottery_prize_scam", label: "Lottery / Prize / Cashback Scam" },
  { id: "impersonation_call", label: "Impersonation Call (Police, Customs, Bank)" },
  { id: "malicious_apk", label: "Malicious Sideloaded APK / App" },
  { id: "job_investment_fraud", label: "Job Offer / Task / Crypto Investment Fraud" },
  { id: "qr_code_scam", label: "Deceptive Payment QR Code Scam" },
  { id: "romance_social_engineering", label: "Romance / Social Engineering" },
  { id: "other", label: "Other Fraud Pattern" },
];

export default function ReportScamModal({ submissionId, defaultCategory = "other", isOpen, onClose, onReportSuccess }) {
  const { token, user } = useAuth();
  const [scamCategory, setScamCategory] = useState(defaultCategory);
  const [otherCategoryNote, setOtherCategoryNote] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        submission_id: submissionId,
        scam_category: scamCategory,
        other_category_note: scamCategory === "other" ? otherCategoryNote.trim() || undefined : undefined,
        additional_context: additionalContext.trim() || undefined,
      };

      const res = await api.createReport(payload, token);
      setSuccess(true);
      if (onReportSuccess) onReportSuccess(res.report);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to submit scam report to the threat registry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel-glow bg-slateDark-900 border border-slate-700 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Report Threat to Community</h3>
              <p className="text-xs text-slate-400">Help protect millions of citizens from this threat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {success ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Threat Report Logged!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Threat signature updated. Your report is now contributing to community threat detection.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Category Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Primary Scam Category *
              </label>
              <select
                value={scamCategory}
                onChange={(e) => setScamCategory(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              >
                {SCAM_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Other Category Note */}
            {scamCategory === "other" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Specify Scam Type *
                </label>
                <input
                  type="text"
                  required
                  value={otherCategoryNote}
                  onChange={(e) => setOtherCategoryNote(e.target.value)}
                  placeholder="Describe the fraud mechanism..."
                  maxLength={500}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>
            )}

            {/* Additional Context */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Additional Public Context (Sanitized)
              </label>
              <textarea
                rows={3}
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Include relevant details (e.g. caller claimed to be CBI, demanded Rs 50,000 via UPI). All personal info is auto-scrubbed."
                maxLength={1000}
                className="w-full glass-input rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Zero PII: All names, emails, and phone numbers will be automatically scrubbed.</span>
              </p>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs shadow-lg shadow-red-500/25 flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? "Publishing Report..." : "Submit Community Report"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

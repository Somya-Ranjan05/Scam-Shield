// client/src/pages/ReportPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "../lib/apiClient";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorBanner from "../components/shared/ErrorBanner";

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

export default function ReportPage() {
  const { submissionId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [scamCategory, setScamCategory] = useState("phishing_link");
  const [otherCategoryNote, setOtherCategoryNote] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  useEffect(() => {
    async function loadSubmission() {
      setLoading(true);
      try {
        const data = await api.getSubmission(submissionId, token);
        setSubmission(data);
        if (data.verdict?.scam_category) {
          setScamCategory(data.verdict.scam_category);
        }
      } catch (err) {
        setError(err.message || "Could not load submission data.");
      } finally {
        setLoading(false);
      }
    }

    if (submissionId) {
      loadSubmission();
    }
  }, [submissionId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=/report/${submissionId}`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.createReport(
        {
          submission_id: submissionId,
          scam_category: scamCategory,
          other_category_note: scamCategory === "other" ? otherCategoryNote.trim() || undefined : undefined,
          additional_context: additionalContext.trim() || undefined,
        },
        token
      );
      setSuccess(true);
      setTimeout(() => {
        navigate("/registry");
      }, 2500);
    } catch (err) {
      setError(err.message || "Failed to submit threat report.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <LoadingSpinner text="Loading Submission Data..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      <Link
        to={`/result/${submissionId}`}
        className="inline-flex items-center space-x-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Scan Verdict</span>
      </Link>

      <div className="rounded-3xl glass-panel-glow bg-slateDark-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Escalate to Community Registry</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Publishing this threat updates the national threat signature database.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Report Successfully Published!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Threat signature logged. Redirecting you to the Public Scam Registry...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Scam Classification *
              </label>
              <select
                value={scamCategory}
                onChange={(e) => setScamCategory(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                {SCAM_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
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
                  placeholder="Describe the fraud pattern..."
                  maxLength={500}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>
            )}

            {/* Additional Context */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Additional Notes / Context for the Public
              </label>
              <textarea
                rows={4}
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Explain what happened (e.g. caller impersonated Mumbai Police on WhatsApp, asked for funds to clear custom parcel). Any personal details will be auto-scrubbed."
                maxLength={1000}
                className="w-full glass-input rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500"
              />
              <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Privacy Guaranteed: Victim identity, email, and personal phone numbers are never published.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Publishing Threat Report..." : "Publish Community Threat Report"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

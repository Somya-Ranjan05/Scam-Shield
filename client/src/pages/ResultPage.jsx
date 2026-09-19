// client/src/pages/ResultPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Shield, ShieldAlert, ArrowLeft, Share2, Copy, Check, Info, FileText, AlertCircle } from "lucide-react";
import { api } from "../lib/apiClient";
import { useAuth } from "../context/AuthContext";
import RiskScoreGauge from "../components/result/RiskScoreGauge";
import RiskTierBadge from "../components/result/RiskTierBadge";
import RedFlagsList from "../components/result/RedFlagsList";
import RecommendedActionSteps from "../components/result/RecommendedActionSteps";
import CommunityMatchBanner from "../components/result/CommunityMatchBanner";
import ReportScamButton from "../components/result/ReportScamButton";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorBanner from "../components/shared/ErrorBanner";

export default function ResultPage() {
  const { submissionId } = useParams();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getSubmission(submissionId, token);
        setData(res);
      } catch (err) {
        setError(err.message || "Could not retrieve the analysis verdict.");
      } finally {
        setLoading(false);
      }
    }

    if (submissionId) {
      fetchResult();
    }
  }, [submissionId, token]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner text="Loading Threat Assessment Report..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-4">
        <ErrorBanner message={error || "Scan record not found."} />
        <Link
          to="/check"
          className="inline-flex items-center space-x-2 text-sm text-brand-400 hover:text-brand-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Fraud Scanner</span>
        </Link>
      </div>
    );
  }

  const verdict = data.verdict;
  const isSafe = verdict?.risk_tier === "safe";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/check"
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another Item</span>
        </Link>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Share Verdict</span>
            </>
          )}
        </button>
      </div>

      {/* Community Threat Match Banner (If applicable) */}
      {data.community_match && (
        <CommunityMatchBanner match={data.community_match} />
      )}

      {/* Main Verdict Card */}
      <div className="rounded-3xl glass-panel-glow bg-slateDark-900/90 border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-8">
        {/* Score and Verdict Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <div className="flex items-center space-x-2.5">
              <RiskTierBadge tier={verdict?.risk_tier} size="lg" />
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-lg">
                {verdict?.scam_category?.replace(/_/g, " ")}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {verdict?.headline_verdict}
            </h1>

            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <span>Confidence: <strong className="text-slate-200 uppercase">{verdict?.confidence_level || "high"}</strong></span>
              <span>•</span>
              <span>Language: <strong className="text-slate-200 uppercase">{verdict?.language || data.preferred_language || "en"}</strong></span>
            </div>
          </div>

          <div className="shrink-0">
            <RiskScoreGauge score={verdict?.risk_score} tier={verdict?.risk_tier} size={170} />
          </div>
        </div>

        {/* Plain Language Explanation */}
        <div className="space-y-2 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-400 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>AI Plain-Language Assessment</span>
          </h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {verdict?.explanation}
          </p>
        </div>

        {/* Red Flags Breakdown */}
        <RedFlagsList redFlags={verdict?.red_flags} isSafe={isSafe} />

        {/* Recommended Safe Next Steps */}
        <RecommendedActionSteps actions={verdict?.recommended_action} />

        {/* Submitted Content Summary Box */}
        <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
          <div className="text-slate-400 font-semibold uppercase tracking-wider flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Submitted Artifact ({data.submission_type?.toUpperCase()})</span>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs break-all max-h-36 overflow-y-auto">
            {data.raw_text || data.raw_url || data.qr_decoded_payload || data.transcribed_text || data.apk_filename}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Auditable AI Verdict ID: <code className="text-slate-300">{data.id}</code>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <ReportScamButton
              submissionId={data.id}
              scamCategory={verdict?.scam_category}
              onReportSuccess={(report) => {
                // update local state
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

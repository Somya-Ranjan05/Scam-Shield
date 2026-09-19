// client/src/pages/CheckPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";
import { api } from "../lib/apiClient";
import { useAuth } from "../context/AuthContext";
import SubmissionTypeTabs from "../components/forms/SubmissionTypeTabs";
import TextSubmissionForm from "../components/forms/TextSubmissionForm";
import LinkSubmissionForm from "../components/forms/LinkSubmissionForm";
import QrUploadForm from "../components/forms/QrUploadForm";
import VoiceUploadForm from "../components/forms/VoiceUploadForm";
import ApkSubmissionForm from "../components/forms/ApkSubmissionForm";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorBanner from "../components/shared/ErrorBanner";

export default function CheckPage() {
  const [activeType, setActiveType] = useState("text");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleTextSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.submitText(data, token);
      navigate(`/result/${res.submission_id}`);
    } catch (err) {
      setError(err.message || "Failed to scan text submission.");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.submitLink(data, token);
      navigate(`/result/${res.submission_id}`);
    } catch (err) {
      setError(err.message || "Failed to scan URL submission.");
    } finally {
      setLoading(false);
    }
  };

  const handleQrSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.submitQr(formData, token);
      navigate(`/result/${res.submission_id}`);
    } catch (err) {
      setError(err.message || "Failed to decode and scan QR code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.submitVoice(formData, token);
      navigate(`/result/${res.submission_id}`);
    } catch (err) {
      setError(err.message || "Failed to transcribe and scan voice recording.");
    } finally {
      setLoading(false);
    }
  };

  const handleApkSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.submitApk(data, token);
      navigate(`/result/${res.submission_id}`);
    } catch (err) {
      setError(err.message || "Failed to scan APK submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold uppercase tracking-wider border border-brand-500/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Multimodal AI Fraud Detector</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Check a Suspicious Message, Link, or File
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Select what you received below. Our AI engine analyzes linguistic urgency, spoofed domains, RAT signatures, and known threats.
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Main Analysis Card */}
      <div className="rounded-3xl glass-panel-glow bg-slateDark-900/90 border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
        <SubmissionTypeTabs activeType={activeType} onChange={setActiveType} />

        {loading ? (
          <LoadingSpinner
            text="Running ScamShield AI Security Analysis..."
            subtext="Evaluating against Indian fraud heuristics, phishing vectors, and community threat database"
          />
        ) : (
          <div>
            {activeType === "text" && (
              <TextSubmissionForm onSubmit={handleTextSubmit} loading={loading} />
            )}
            {activeType === "link" && (
              <LinkSubmissionForm onSubmit={handleLinkSubmit} loading={loading} />
            )}
            {activeType === "qr" && (
              <QrUploadForm onSubmit={handleQrSubmit} loading={loading} />
            )}
            {activeType === "voice" && (
              <VoiceUploadForm onSubmit={handleVoiceSubmit} loading={loading} />
            )}
            {activeType === "apk" && (
              <ApkSubmissionForm onSubmit={handleApkSubmit} loading={loading} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

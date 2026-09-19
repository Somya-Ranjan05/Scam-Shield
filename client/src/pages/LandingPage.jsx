// client/src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Shield, ShieldAlert, ArrowRight, MessageSquare, Link2, QrCode, Mic, Smartphone, CheckCircle, Zap, Users, Lock } from "lucide-react";
import LiveStatsCounter from "../components/stats/LiveStatsCounter";

export default function LandingPage() {
  const capabilities = [
    {
      icon: MessageSquare,
      title: "SMS & WhatsApp Phishing",
      desc: "Detect urgent fake KYC notices, lottery draws, unpaid electricity threats, and OTP demands.",
    },
    {
      icon: Link2,
      title: "Deceptive URLs & Links",
      desc: "Analyze lookalike banking domains, typosquatting, shortlinks, and credential harvesting traps.",
    },
    {
      icon: QrCode,
      title: "QR Code Reverse Scams",
      desc: "Decode embedded payloads server-side to prevent fake payment reception & malicious app installs.",
    },
    {
      icon: Mic,
      title: "Voice Deepfakes & Calls",
      desc: "Transcribe and analyze audio notes and calls impersonating Police, CBI, Customs, or Banks.",
    },
    {
      icon: Smartphone,
      title: "Sideloaded Malicious APKs",
      desc: "Inspect APK package names and download links for dangerous remote access Trojans (RATs).",
    },
    {
      icon: Users,
      title: "Community Threat Intelligence",
      desc: "When a phone or domain is reported by others, instant warnings protect subsequent users.",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 text-center max-w-5xl mx-auto px-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-slow">
          <Shield className="w-4 h-4" />
          <span>Real-Time Digital Fraud Shield</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Instant, AI-Powered Fraud Defense in{" "}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Plain Language
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Received a suspicious SMS, WhatsApp message, unknown link, QR code, voice call, or APK? Paste it into ScamShield and get a 0–100 risk score, explainable red flags, and safe instructions in your regional language.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/check"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-brand-500/30 flex items-center justify-center space-x-2 transition-all duration-200 group"
          >
            <span>Check a Message or Link Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/registry"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-colors"
          >
            Browse Threat Registry
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>100% Free & Anonymous Scans</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-brand-400" />
            <span>Zero PII Stored</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Under 5-Second Response</span>
          </span>
        </div>
      </section>

      {/* Live Counter Stats */}
      <section className="px-4">
        <LiveStatsCounter />
      </section>

      {/* Multi-modal capabilities grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Comprehensive Multi-Modal Threat Detection
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Scammers use multiple channels to target victims. ScamShield provides unified threat detection across all attack surfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel border border-slate-800/90 hover:border-brand-500/40 transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel-glow border border-brand-500/20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            How ScamShield Protects You in 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-extrabold flex items-center justify-center text-lg">
                1
              </div>
              <h4 className="text-base font-bold text-white">Paste or Upload Content</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Paste message text, enter a suspicious link, upload a QR code image, or share a voice note.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg">
                2
              </div>
              <h4 className="text-base font-bold text-white">AI Multimodal Scan</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                ScamShield AI cross-references language heuristics, known cyber threat signatures, and domain reputation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg">
                3
              </div>
              <h4 className="text-base font-bold text-white">Get Verdict & Safe Action</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive an explainable 0–100 risk score, clear breakdown of red flags, and exact steps to protect yourself.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              to="/check"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 transition-colors shadow-lg"
            >
              <span>Scan Suspicious Item Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

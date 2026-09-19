// client/src/components/shared/AppFooter.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react";

export default function AppFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slateDark-950 mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ScamShield</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Real-time, multimodal AI threat intelligence for Indian digital consumers. Protecting against SMS phishing, fake UPI/banking requests, malicious APKs, voice deepfakes, and deceptive QR traps.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-PII Storage on Public Registries • Privacy-First Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/check" className="hover:text-brand-400 transition-colors">
                  Check Suspicious Message
                </Link>
              </li>
              <li>
                <Link to="/registry" className="hover:text-brand-400 transition-colors">
                  Public Scam Registry
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-400 transition-colors">
                  My Scan Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-400 transition-colors">
                  Citizen Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Languages Supported */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Languages Supported</h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">English</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">हिंदी</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">ಕನ್ನಡ</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">தமிழ்</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">తెలుగు</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">മലയാളം</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">বাংলা</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">मराठी</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <div>© {new Date().getFullYear()} ScamShield Threat Intelligence. Built for National Cyber Defense.</div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-400">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>In emergency financial fraud, dial National Helpline 1930 immediately.</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

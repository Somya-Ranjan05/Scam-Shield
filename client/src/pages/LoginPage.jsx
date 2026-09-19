// client/src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, Lock, Mail, ArrowRight, UserCheck, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ErrorBanner from "../components/shared/ErrorBanner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { login, loginQuickDev, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setSubmitting(true);
    setError(null);

    try {
      await login(email.trim(), password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (asAdmin = false) => {
    loginQuickDev(asAdmin);
    navigate(asAdmin ? "/admin/moderation" : redirectPath, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
      <div className="rounded-3xl glass-panel-glow bg-slateDark-900 border border-slate-700/80 p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Citizen Sign In</h1>
          <p className="text-xs text-slate-400">
            Sign in to report scams, access your scan history, and receive safety alerts.
          </p>
        </div>

        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        {/* Quick Demo Access (for seamless local development / demoing) */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Quick Dev / Demo Logins
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin(false)}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Standard User</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin(true)}
              className="py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Moderator</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full glass-input rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full glass-input rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{submitting ? "Signing in..." : "Sign In to ScamShield"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link to={`/signup?redirect=${redirectPath}`} className="text-brand-400 hover:text-brand-300 font-semibold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

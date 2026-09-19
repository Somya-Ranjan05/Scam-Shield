// client/src/pages/SignupPage.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ErrorBanner from "../components/shared/ErrorBanner";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await signup(email.trim(), password, displayName.trim());
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
      <div className="rounded-3xl glass-panel-glow bg-slateDark-900 border border-slate-700/80 p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-xs text-slate-400">
            Join the collective cyber defense network to protect your community.
          </p>
        </div>

        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Full Name or Alias
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Citizen User"
                className="w-full glass-input rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Email Address *
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
              Password (min. 6 characters) *
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
                minLength={6}
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
            <span>{submitting ? "Creating Account..." : "Join ScamShield"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link to={`/login?redirect=${redirectPath}`} className="text-brand-400 hover:text-brand-300 font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

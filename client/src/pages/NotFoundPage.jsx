// client/src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white">404</h1>
        <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          The threat report or page you are trying to access does not exist or has been relocated.
        </p>
      </div>
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Safe Haven</span>
        </Link>
      </div>
    </div>
  );
}

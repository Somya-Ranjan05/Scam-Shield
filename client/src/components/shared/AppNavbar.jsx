// client/src/components/shared/AppNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, ShieldAlert, FileSearch, Database, LayoutDashboard, Lock, LogOut, Menu, X, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AppNavbar() {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
                ScamShield
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                AI Threat Defense
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/check"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive("/check")
                  ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>Check Fraud</span>
            </Link>

            <Link
              to="/registry"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive("/registry")
                  ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Threat Registry</span>
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  isActive("/dashboard")
                    ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Scans</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/moderation"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  isActive("/admin/moderation")
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-amber-300 hover:text-amber-200 hover:bg-amber-500/10"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Moderation Queue</span>
              </Link>
            )}
          </div>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700/50">
                  <User className="w-3.5 h-3.5 text-brand-400" />
                  <span className="truncate max-w-[120px]">{user.email}</span>
                  {isAdmin && (
                    <span className="bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.2 text-[10px] rounded border border-amber-500/30">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-brand-500/25 transition-all duration-200"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slateDark-900/95 px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/check"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Check Fraud
          </Link>
          <Link
            to="/registry"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Threat Registry
          </Link>
          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              My Scans & History
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin/moderation"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-amber-400 hover:bg-amber-500/10"
            >
              Admin Moderation Queue
            </Link>
          )}

          <div className="pt-3 border-t border-slate-800/80">
            {user ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 px-3">Signed in as {user.email}</div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm text-white bg-brand-600 rounded-lg hover:bg-brand-500 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// client/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppNavbar from "./components/shared/AppNavbar";
import AppFooter from "./components/shared/AppFooter";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import AdminRoute from "./components/shared/AdminRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import CheckPage from "./pages/CheckPage";
import ResultPage from "./pages/ResultPage";
import ReportPage from "./pages/ReportPage";
import RegistryPage from "./pages/RegistryPage";
import RegistryDetailPage from "./pages/RegistryDetailPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminModerationPage from "./pages/AdminModerationPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slateDark-950 text-slate-100">
      <AppNavbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/check" element={<CheckPage />} />
          <Route path="/result/:submissionId" element={<ResultPage />} />
          <Route path="/registry" element={<RegistryPage />} />
          <Route path="/registry/:reportId" element={<RegistryDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Authenticated Protected Routes */}
          <Route
            path="/report/:submissionId"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Role-Gated Admin Routes */}
          <Route
            path="/admin/moderation"
            element={
              <AdminRoute>
                <AdminModerationPage />
              </AdminRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <AppFooter />
    </div>
  );
}

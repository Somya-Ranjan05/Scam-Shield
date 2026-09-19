// client/src/pages/RegistryPage.jsx
import React, { useState, useEffect } from "react";
import { Database, ShieldAlert, Sparkles } from "lucide-react";
import { api } from "../lib/apiClient";
import RegistrySearchBar from "../components/registry/RegistrySearchBar";
import RegistryResultCard from "../components/registry/RegistryResultCard";
import RegistryPagination from "../components/registry/RegistryPagination";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import EmptyState from "../components/shared/EmptyState";
import ErrorBanner from "../components/shared/ErrorBanner";

export default function RegistryPage() {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async (pageToFetch = 1, searchQuery = search, cat = category) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getRegistryReports({
        page: pageToFetch,
        limit: 12,
        search: searchQuery || undefined,
        category: cat !== "all" ? cat : undefined,
      });

      setReports(res.reports || []);
      setTotal(res.total || 0);
      setPage(res.page || 1);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load public threat registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchReports(1, search, category);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, category]);

  const handlePageChange = (newPage) => {
    fetchReports(newPage, search, category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold uppercase tracking-wider border border-brand-500/20">
          <Database className="w-3.5 h-3.5" />
          <span>National Threat Intelligence Feed</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Public Scam Registry
        </h1>
        <p className="text-sm text-slate-400">
          Search verified scam signatures, malicious phishing domains, predatory APK packages, and fraudulent phone numbers reported by citizens across India.
        </p>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Search and Filters */}
      <RegistrySearchBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        category={category}
        onCategoryChange={(val) => {
          setCategory(val);
          setPage(1);
        }}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <strong className="text-white">{reports.length}</strong> of <strong className="text-white">{total}</strong> verified threat records
        </div>
        {category !== "all" && (
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
            Filtered: {category.replace(/_/g, " ")}
          </span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Searching Threat Registry..." />
      ) : reports.length === 0 ? (
        <EmptyState
          title="No verified threats matching your search"
          description="Try searching with a different keyword, telephone prefix (+91), domain, or category filter."
          actionText="Check a Suspicious Message"
          actionLink="/check"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reports.map((report) => (
              <RegistryResultCard key={report.id} report={report} />
            ))}
          </div>

          <RegistryPagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

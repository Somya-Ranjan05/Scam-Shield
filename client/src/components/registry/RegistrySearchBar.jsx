// client/src/components/registry/RegistrySearchBar.jsx
import React from "react";
import { Search, Filter, X } from "lucide-react";

const CATEGORY_OPTIONS = [
  { id: "all", label: "All Scam Categories" },
  { id: "phishing_link", label: "Phishing Links" },
  { id: "fake_banking_upi", label: "Fake Banking & UPI" },
  { id: "lottery_prize_scam", label: "Lottery & Prize Scams" },
  { id: "impersonation_call", label: "Impersonation Calls" },
  { id: "malicious_apk", label: "Malicious APKs" },
  { id: "job_investment_fraud", label: "Job & Investment Scams" },
  { id: "qr_code_scam", label: "Deceptive QR Codes" },
  { id: "romance_social_engineering", label: "Social Engineering" },
  { id: "other", label: "Other Patterns" },
];

export default function RegistrySearchBar({ search, onSearchChange, category, onCategoryChange, onReset }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl glass-panel border border-slate-800 mb-8">
      {/* Search Query Input */}
      <div className="relative md:col-span-2">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by suspicious phone (+91...), domain (sbi-kyc...), APK name, or keyword..."
          className="w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Dropdown Filter */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Filter className="w-4 h-4" />
        </div>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-200 appearance-none focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

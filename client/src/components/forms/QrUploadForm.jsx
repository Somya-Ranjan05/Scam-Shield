// client/src/components/forms/QrUploadForm.jsx
import React, { useState, useRef } from "react";
import { QrCode, Upload, HelpCircle, ShieldCheck, Image as ImageIcon, X } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

export default function QrUploadForm({ onSubmit, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [additionalContext, setAdditionalContext] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File exceeds maximum allowed size of 5MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("qr_image", selectedFile);
    formData.append("preferred_language", preferredLanguage);
    if (additionalContext.trim()) {
      formData.append("additional_context", additionalContext.trim());
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* QR Code File Upload Dropzone */}
      <div className="space-y-1.5">
        <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <QrCode className="w-3.5 h-3.5 text-brand-400" />
          <span>Upload QR Code Image *</span>
        </label>

        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-brand-500/80 bg-slate-900/60 hover:bg-slate-900/90 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                Click to browse or drop QR screenshot here
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Supports PNG, JPEG, JPG, WebP up to 5MB
              </p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl border border-slate-700 bg-slate-900/80 p-4 flex items-center space-x-4">
            <img
              src={previewUrl}
              alt="QR Preview"
              className="w-20 h-20 object-contain rounded-lg bg-black/40 border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-200 truncate">{selectedFile.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Ready for server-side payload extraction</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Language Selector & Additional Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LanguageSelector value={preferredLanguage} onChange={setPreferredLanguage} />

        <div className="space-y-1.5">
          <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
            <span>Additional Context (Optional)</span>
          </label>
          <input
            type="text"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="e.g. Someone told me scanning this receives money on OLX"
            maxLength={1000}
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !selectedFile}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <ShieldCheck className="w-5 h-5" />
        <span>{loading ? "Decoding & Inspecting QR..." : "Decode & Scan QR Code"}</span>
      </button>
    </form>
  );
}

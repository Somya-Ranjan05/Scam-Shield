// client/src/components/forms/VoiceUploadForm.jsx
import React, { useState, useRef } from "react";
import { Mic, Upload, HelpCircle, ShieldCheck, Volume2, X } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

export default function VoiceUploadForm({ onSubmit, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [additionalContext, setAdditionalContext] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("Audio file exceeds maximum allowed size of 15MB.");
        return;
      }
      setSelectedFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setAudioUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("audio_file", selectedFile);
    formData.append("preferred_language", preferredLanguage);
    if (additionalContext.trim()) {
      formData.append("additional_context", additionalContext.trim());
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Voice Audio File Upload Dropzone */}
      <div className="space-y-1.5">
        <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <Mic className="w-3.5 h-3.5 text-brand-400" />
          <span>Upload Call Recording or WhatsApp Voice Note *</span>
        </label>

        {!audioUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-brand-500/80 bg-slate-900/60 hover:bg-slate-900/90 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                Click to browse audio recording or drag & drop here
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Accepts MP3, WAV, M4A, OGG, WebM (up to 15MB / 3 mins)
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200 truncate max-w-xs">{selectedFile.name}</div>
                  <div className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</div>
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
            <audio src={audioUrl} controls className="w-full h-8" />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/mp4,audio/wav,audio/x-wav,audio/ogg,audio/x-m4a,audio/webm,audio/aac"
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
            placeholder="e.g. Caller claimed to be Mumbai Police regarding drugs in parcel"
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
        <span>{loading ? "Transcribing & Analyzing Call..." : "Transcribe & Scan Voice Audio"}</span>
      </button>
    </form>
  );
}

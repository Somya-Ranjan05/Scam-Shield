// client/src/components/result/ReportScamButton.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ReportScamModal from "./ReportScamModal";

export default function ReportScamButton({ submissionId, scamCategory = "other", onReportSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    if (!user) {
      // Prompt user to sign in to attribute community report
      navigate(`/login?redirect=/report/${submissionId}`);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-4 py-2.5 rounded-xl bg-red-950/70 hover:bg-red-900/90 text-red-300 hover:text-white border border-red-800/60 font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all duration-200 shadow-md shadow-red-950/40"
      >
        <ShieldAlert className="w-4 h-4 text-red-400" />
        <span>Report This Scam to Community</span>
      </button>

      {modalOpen && (
        <ReportScamModal
          submissionId={submissionId}
          defaultCategory={scamCategory}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onReportSuccess={onReportSuccess}
        />
      )}
    </>
  );
}

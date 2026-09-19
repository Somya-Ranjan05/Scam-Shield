// server/controllers/reports.controller.js
import { createReportSchema } from "../schemas/reportSchemas.js";
import { dbService } from "../services/supabase.service.js";
import { normalizeDomain, normalizePhone, normalizePackageName } from "../services/threatMatching.service.js";

/**
 * Scrubs any personal information, victim names, or personal numbers from public summary.
 */
function generatePublicSummary(submission, category, userContext) {
  let mainEntity = "Suspicious communication";
  if (submission.normalized_domain) {
    mainEntity = `Malicious link targeting domain [${submission.normalized_domain}]`;
  } else if (submission.apk_filename || submission.apk_package_name) {
    mainEntity = `Sideloaded APK payload [${submission.apk_filename || submission.apk_package_name}]`;
  } else if (submission.submission_type === "qr_code") {
    mainEntity = `Deceptive QR code payment / redirection trap`;
  } else if (submission.submission_type === "voice") {
    mainEntity = `Impersonation voice call / audio message`;
  } else if (submission.submission_type === "text") {
    mainEntity = `Fraudulent SMS/WhatsApp message`;
  }

  let summary = `${mainEntity} categorized under "${category.replace(/_/g, " ").toUpperCase()}".`;
  if (userContext && userContext.trim()) {
    // Basic sanitization: strip any email or 10-digit number from context
    const cleanContext = userContext
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]")
      .replace(/(?:\+91|91)?\s?[6789]\d{9}/g, "[REDACTED_PHONE]");
    summary += ` Additional details: ${cleanContext}`;
  }

  return summary;
}

export const reportsController = {
  // Create community scam report from a submission
  async createReport(req, res, next) {
    try {
      const validated = createReportSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "You must be signed in to submit a community threat report.",
          },
        });
      }

      // Verify submission exists
      const submissionWithVerdict = await dbService.getSubmissionWithVerdict(validated.submission_id);
      if (!submissionWithVerdict) {
        return res.status(404).json({
          success: false,
          error: {
            code: "SUBMISSION_NOT_FOUND",
            message: "Referenced submission ID does not exist.",
          },
        });
      }

      // Extract primary threat signature
      let signature = 
        submissionWithVerdict.normalized_domain ||
        submissionWithVerdict.normalized_phone ||
        submissionWithVerdict.apk_package_name ||
        submissionWithVerdict.apk_filename ||
        (submissionWithVerdict.sender_id ? normalizePhone(submissionWithVerdict.sender_id) : null) ||
        `scam-pattern-${submissionWithVerdict.submission_type}-${submissionWithVerdict.id.slice(0, 8)}`;

      // Record / update threat signature count
      const threatEntry = await dbService.recordThreatReport({
        signature,
        scamCategory: validated.scam_category,
        riskScore: submissionWithVerdict.verdict?.risk_score || 80,
      });

      // If aggregate report count >= 3, automatically upgrade to community_verified
      let initialStatus = "pending_review";
      if (threatEntry && threatEntry.total_reports >= 3) {
        initialStatus = "community_verified";
      }

      const publicSummary = generatePublicSummary(
        submissionWithVerdict,
        validated.scam_category,
        validated.additional_context
      );

      const report = await dbService.createScamReport({
        submission_id: validated.submission_id,
        reported_by: userId,
        scam_category: validated.scam_category,
        other_category_note: validated.other_category_note || null,
        public_summary: publicSummary,
        status: initialStatus,
        report_count: threatEntry ? threatEntry.total_reports : 1,
        threat_signature: signature,
      });

      res.status(201).json({
        success: true,
        data: {
          report,
          threat_signature: threatEntry,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

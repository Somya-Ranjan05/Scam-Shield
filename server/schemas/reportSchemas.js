// server/schemas/reportSchemas.js
import { z } from "zod";

export const createReportSchema = z.object({
  submission_id: z.string().uuid("Invalid submission ID format"),
  scam_category: z.enum([
    "phishing_link",
    "fake_banking_upi",
    "lottery_prize_scam",
    "impersonation_call",
    "malicious_apk",
    "job_investment_fraud",
    "qr_code_scam",
    "romance_social_engineering",
    "other"
  ]),
  other_category_note: z.string().max(500).optional().nullable(),
  additional_context: z.string().max(1000).optional().nullable(),
});

export const updateReportStatusSchema = z.object({
  status: z.enum(["pending_review", "community_verified", "admin_verified", "rejected"]),
});

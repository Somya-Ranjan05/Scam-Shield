// server/schemas/aiResponseSchemas.js
import { z } from "zod";

export const scamVerdictSchema = z.object({
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
  risk_score: z.number().int().min(0).max(100),
  risk_tier: z.enum(["safe", "suspicious", "dangerous", "confirmed_scam"]),
  headline_verdict: z.string().min(1),
  red_flags: z.array(z.string()),
  explanation: z.string().min(1),
  recommended_action: z.array(z.string()).min(1),
  confidence_level: z.enum(["low", "medium", "high"]),
});

export const transcriptionSchema = z.object({
  transcript: z.string(),
  detected_languages: z.array(z.string()),
  audio_quality_note: z.string().optional().nullable(),
});

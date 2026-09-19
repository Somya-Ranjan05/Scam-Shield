// server/schemas/submissionSchemas.js
import { z } from "zod";

export const textSubmissionSchema = z.object({
  message_body: z.string().min(1, "Message body cannot be empty").max(5000, "Message body exceeds 5000 characters"),
  sender_id: z.string().max(100).optional().nullable(),
  additional_context: z.string().max(1000).optional().nullable(),
  preferred_language: z.enum(["en", "hi", "kn", "ta", "te", "ml", "bn", "mr"]).default("en"),
});

export const linkSubmissionSchema = z.object({
  url: z.string().url("A valid URL starting with http:// or https:// is required"),
  additional_context: z.string().max(1000).optional().nullable(),
  preferred_language: z.enum(["en", "hi", "kn", "ta", "te", "ml", "bn", "mr"]).default("en"),
});

export const apkSubmissionSchema = z.object({
  apk_filename: z.string().min(1, "APK filename is required").max(255),
  package_name: z.string().max(255).optional().nullable(),
  source_link: z.string().url("Source link must be a valid URL").optional().nullable().or(z.literal("")),
  additional_context: z.string().max(1000).optional().nullable(),
  preferred_language: z.enum(["en", "hi", "kn", "ta", "te", "ml", "bn", "mr"]).default("en"),
});

export const qrSubmissionSchema = z.object({
  additional_context: z.string().max(1000).optional().nullable(),
  preferred_language: z.enum(["en", "hi", "kn", "ta", "te", "ml", "bn", "mr"]).default("en"),
});

export const voiceSubmissionSchema = z.object({
  additional_context: z.string().max(1000).optional().nullable(),
  preferred_language: z.enum(["en", "hi", "kn", "ta", "te", "ml", "bn", "mr"]).default("en"),
});

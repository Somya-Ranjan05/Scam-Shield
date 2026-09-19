// server/routes/submissions.routes.js
import { Router } from "express";
import { submissionsController } from "../controllers/submissions.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { aiSubmissionRateLimiter } from "../middleware/rateLimit.middleware.js";
import { uploadQrImage, uploadVoiceAudio } from "../middleware/uploadHandler.middleware.js";

const router = Router();

// Text submission (SMS/WhatsApp/Email)
router.post(
  "/text",
  aiSubmissionRateLimiter,
  authenticateUser({ requireAuth: false }),
  submissionsController.submitText
);

// Link submission
router.post(
  "/link",
  aiSubmissionRateLimiter,
  authenticateUser({ requireAuth: false }),
  submissionsController.submitLink
);

// QR image submission
router.post(
  "/qr",
  aiSubmissionRateLimiter,
  uploadQrImage,
  authenticateUser({ requireAuth: false }),
  submissionsController.submitQr
);

// Voice audio submission
router.post(
  "/voice",
  aiSubmissionRateLimiter,
  uploadVoiceAudio,
  authenticateUser({ requireAuth: false }),
  submissionsController.submitVoice
);

// APK submission
router.post(
  "/apk",
  aiSubmissionRateLimiter,
  authenticateUser({ requireAuth: false }),
  submissionsController.submitApk
);

// Get submission by ID (with verdict)
router.get(
  "/:id",
  authenticateUser({ requireAuth: false }),
  submissionsController.getSubmissionById
);

export default router;

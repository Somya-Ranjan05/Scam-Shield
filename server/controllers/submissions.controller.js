// server/controllers/submissions.controller.js
import { textSubmissionSchema, linkSubmissionSchema, apkSubmissionSchema, qrSubmissionSchema, voiceSubmissionSchema } from "../schemas/submissionSchemas.js";
import { analyzeScamRisk } from "../services/geminiAnalysis.service.js";
import { transcribeAudioBuffer } from "../services/geminiTranscription.service.js";
import { decodeQrBuffer } from "../services/qrDecoder.service.js";
import { checkCommunityThreat, normalizeDomain, normalizePhone, normalizePackageName } from "../services/threatMatching.service.js";
import { dbService } from "../services/supabase.service.js";

export const submissionsController = {
  // Text Submission (SMS, WhatsApp, Email)
  async submitText(req, res, next) {
    try {
      const validated = textSubmissionSchema.parse(req.body);
      const userId = req.user?.id || null;

      const normPhone = validated.sender_id ? normalizePhone(validated.sender_id) : null;
      const threatCheck = await checkCommunityThreat({
        submission_type: "text",
        raw_text: validated.message_body,
        sender_id: validated.sender_id,
      });

      const { verdict, modelName, rawModelResponse } = await analyzeScamRisk({
        submissionType: "text",
        rawContent: validated.message_body,
        senderId: validated.sender_id,
        additionalContext: validated.additional_context,
        preferredLanguage: validated.preferred_language,
        communityMatchInfo: threatCheck.matchInfo,
        communityBoost: threatCheck.boost,
      });

      const submission = await dbService.createSubmission({
        user_id: userId,
        submission_type: "text",
        raw_text: validated.message_body,
        sender_id: validated.sender_id,
        additional_context: validated.additional_context,
        preferred_language: validated.preferred_language,
        normalized_phone: normPhone,
        client_ip_hash: req.ip,
      });

      const createdVerdict = await dbService.createVerdict({
        submission_id: submission.id,
        scam_category: verdict.scam_category,
        risk_score: verdict.risk_score,
        risk_tier: verdict.risk_tier,
        headline_verdict: verdict.headline_verdict,
        red_flags: verdict.red_flags,
        explanation: verdict.explanation,
        recommended_action: verdict.recommended_action,
        confidence_level: verdict.confidence_level,
        community_match_boost: threatCheck.boost,
        language: validated.preferred_language,
        raw_model_response: rawModelResponse,
        model_name: modelName,
      });

      res.status(201).json({
        success: true,
        data: {
          submission_id: submission.id,
          submission,
          verdict: createdVerdict,
          community_match: threatCheck.hasMatch ? {
            total_reports: threatCheck.totalReports,
            signature: threatCheck.threat?.signature,
          } : null,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // Link / URL Submission
  async submitLink(req, res, next) {
    try {
      const validated = linkSubmissionSchema.parse(req.body);
      const userId = req.user?.id || null;
      const domain = normalizeDomain(validated.url);

      const threatCheck = await checkCommunityThreat({
        submission_type: "link",
        raw_url: validated.url,
      });

      const { verdict, modelName, rawModelResponse } = await analyzeScamRisk({
        submissionType: "link",
        rawContent: validated.url,
        senderId: domain,
        additionalContext: validated.additional_context,
        preferredLanguage: validated.preferred_language,
        communityMatchInfo: threatCheck.matchInfo,
        communityBoost: threatCheck.boost,
      });

      const submission = await dbService.createSubmission({
        user_id: userId,
        submission_type: "link",
        raw_url: validated.url,
        normalized_domain: domain,
        additional_context: validated.additional_context,
        preferred_language: validated.preferred_language,
        client_ip_hash: req.ip,
      });

      const createdVerdict = await dbService.createVerdict({
        submission_id: submission.id,
        scam_category: verdict.scam_category,
        risk_score: verdict.risk_score,
        risk_tier: verdict.risk_tier,
        headline_verdict: verdict.headline_verdict,
        red_flags: verdict.red_flags,
        explanation: verdict.explanation,
        recommended_action: verdict.recommended_action,
        confidence_level: verdict.confidence_level,
        community_match_boost: threatCheck.boost,
        language: validated.preferred_language,
        raw_model_response: rawModelResponse,
        model_name: modelName,
      });

      res.status(201).json({
        success: true,
        data: {
          submission_id: submission.id,
          submission,
          verdict: createdVerdict,
          community_match: threatCheck.hasMatch ? {
            total_reports: threatCheck.totalReports,
            signature: threatCheck.threat?.signature,
          } : null,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // QR Code Image Submission
  async submitQr(req, res, next) {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({
          success: false,
          error: {
            code: "MISSING_FILE",
            message: "A QR code image file (PNG, JPG, WebP) must be uploaded.",
          },
        });
      }

      const validated = qrSubmissionSchema.parse(req.body);
      const userId = req.user?.id || null;

      // Decode QR payload server-side
      const qrResult = await decodeQrBuffer(req.file.buffer);
      if (!qrResult || !qrResult.payload) {
        return res.status(422).json({
          success: false,
          error: {
            code: "QR_DECODE_FAILED",
            message: "Could not detect or decode a valid QR code in the uploaded image. Please ensure the QR code is clear, well-lit, and unobstructed.",
          },
        });
      }

      const payload = qrResult.payload;
      const domain = normalizeDomain(payload);

      const threatCheck = await checkCommunityThreat({
        submission_type: "qr_code",
        qr_decoded_payload: payload,
      });

      const { verdict, modelName, rawModelResponse } = await analyzeScamRisk({
        submissionType: "qr_code",
        rawContent: `Decoded QR Code payload: "${payload}"`,
        senderId: domain || "QR Code Destination",
        additionalContext: validated.additional_context,
        preferredLanguage: validated.preferred_language,
        communityMatchInfo: threatCheck.matchInfo,
        communityBoost: threatCheck.boost,
      });

      const submission = await dbService.createSubmission({
        user_id: userId,
        submission_type: "qr_code",
        qr_decoded_payload: payload,
        normalized_domain: domain,
        additional_context: validated.additional_context,
        preferred_language: validated.preferred_language,
        client_ip_hash: req.ip,
      });

      const createdVerdict = await dbService.createVerdict({
        submission_id: submission.id,
        scam_category: verdict.scam_category,
        risk_score: verdict.risk_score,
        risk_tier: verdict.risk_tier,
        headline_verdict: verdict.headline_verdict,
        red_flags: verdict.red_flags,
        explanation: verdict.explanation,
        recommended_action: verdict.recommended_action,
        confidence_level: verdict.confidence_level,
        community_match_boost: threatCheck.boost,
        language: validated.preferred_language,
        raw_model_response: rawModelResponse,
        model_name: modelName,
      });

      res.status(201).json({
        success: true,
        data: {
          submission_id: submission.id,
          submission,
          verdict: createdVerdict,
          decoded_payload: payload,
          community_match: threatCheck.hasMatch ? {
            total_reports: threatCheck.totalReports,
            signature: threatCheck.threat?.signature,
          } : null,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // Voice Note Audio Submission
  async submitVoice(req, res, next) {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({
          success: false,
          error: {
            code: "MISSING_FILE",
            message: "An audio file (MP3, WAV, M4A, OGG, WebM) must be uploaded.",
          },
        });
      }

      const validated = voiceSubmissionSchema.parse(req.body);
      const userId = req.user?.id || null;

      // Transcribe audio via Gemini audio engine
      const transcription = await transcribeAudioBuffer({
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
      });

      const transcriptText = transcription.transcript;

      const threatCheck = await checkCommunityThreat({
        submission_type: "voice",
        raw_text: transcriptText,
      });

      const { verdict, modelName, rawModelResponse } = await analyzeScamRisk({
        submissionType: "voice",
        rawContent: transcriptText,
        senderId: "Voice Call / Audio Message",
        additionalContext: validated.additional_context,
        preferredLanguage: validated.preferred_language,
        communityMatchInfo: threatCheck.matchInfo,
        communityBoost: threatCheck.boost,
      });

      const submission = await dbService.createSubmission({
        user_id: userId,
        submission_type: "voice",
        transcribed_text: transcriptText,
        additional_context: validated.additional_context,
        preferred_language: validated.preferred_language,
        client_ip_hash: req.ip,
      });

      const createdVerdict = await dbService.createVerdict({
        submission_id: submission.id,
        scam_category: verdict.scam_category,
        risk_score: verdict.risk_score,
        risk_tier: verdict.risk_tier,
        headline_verdict: verdict.headline_verdict,
        red_flags: verdict.red_flags,
        explanation: verdict.explanation,
        recommended_action: verdict.recommended_action,
        confidence_level: verdict.confidence_level,
        community_match_boost: threatCheck.boost,
        language: validated.preferred_language,
        raw_model_response: rawModelResponse,
        model_name: modelName,
      });

      res.status(201).json({
        success: true,
        data: {
          submission_id: submission.id,
          submission,
          verdict: createdVerdict,
          transcribed_text: transcriptText,
          detected_languages: transcription.detected_languages,
          community_match: threatCheck.hasMatch ? {
            total_reports: threatCheck.totalReports,
            signature: threatCheck.threat?.signature,
          } : null,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // APK Submission
  async submitApk(req, res, next) {
    try {
      const validated = apkSubmissionSchema.parse(req.body);
      const userId = req.user?.id || null;
      const normalizedPkg = normalizePackageName(validated.package_name);
      const normalizedDomain = validated.source_link ? normalizeDomain(validated.source_link) : null;

      const threatCheck = await checkCommunityThreat({
        submission_type: "apk",
        apk_filename: validated.apk_filename,
        apk_package_name: validated.package_name,
        raw_url: validated.source_link,
      });

      const rawContent = `APK Filename: "${validated.apk_filename}"\nPackage Name: "${validated.package_name || "Unknown"}"\nSource Link: "${validated.source_link || "Direct download / chat file"}"`;

      const { verdict, modelName, rawModelResponse } = await analyzeScamRisk({
        submissionType: "apk",
        rawContent,
        senderId: validated.package_name || validated.apk_filename,
        additionalContext: validated.additional_context,
        preferredLanguage: validated.preferred_language,
        communityMatchInfo: threatCheck.matchInfo,
        communityBoost: threatCheck.boost,
      });

      const submission = await dbService.createSubmission({
        user_id: userId,
        submission_type: "apk",
        apk_filename: validated.apk_filename,
        apk_package_name: validated.package_name,
        apk_source_link: validated.source_link,
        normalized_domain: normalizedDomain,
        additional_context: validated.additional_context,
        preferred_language: validated.preferred_language,
        client_ip_hash: req.ip,
      });

      const createdVerdict = await dbService.createVerdict({
        submission_id: submission.id,
        scam_category: verdict.scam_category,
        risk_score: verdict.risk_score,
        risk_tier: verdict.risk_tier,
        headline_verdict: verdict.headline_verdict,
        red_flags: verdict.red_flags,
        explanation: verdict.explanation,
        recommended_action: verdict.recommended_action,
        confidence_level: verdict.confidence_level,
        community_match_boost: threatCheck.boost,
        language: validated.preferred_language,
        raw_model_response: rawModelResponse,
        model_name: modelName,
      });

      res.status(201).json({
        success: true,
        data: {
          submission_id: submission.id,
          submission,
          verdict: createdVerdict,
          community_match: threatCheck.hasMatch ? {
            total_reports: threatCheck.totalReports,
            signature: threatCheck.threat?.signature,
          } : null,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // Get Submission by ID (with verdict)
  async getSubmissionById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await dbService.getSubmissionWithVerdict(id);

      if (!data) {
        return res.status(404).json({
          success: false,
          error: {
            code: "SUBMISSION_NOT_FOUND",
            message: "The requested fraud scan submission was not found.",
          },
        });
      }

      // Check for threat match to enrich the result page
      const signatures = [];
      if (data.normalized_domain) signatures.push(data.normalized_domain);
      if (data.normalized_phone) signatures.push(data.normalized_phone);
      if (data.apk_package_name) signatures.push(data.apk_package_name);
      if (data.apk_filename) signatures.push(data.apk_filename);

      const match = await dbService.findThreatMatch(signatures);

      res.json({
        success: true,
        data: {
          ...data,
          community_match: match ? {
            total_reports: match.total_reports,
            signature: match.signature,
          } : null,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

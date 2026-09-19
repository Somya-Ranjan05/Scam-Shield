// server/services/threatMatching.service.js
import { dbService } from "./supabase.service.js";

/**
 * Normalizes a URL into a clean domain name.
 */
export function normalizeDomain(urlStr) {
  if (!urlStr) return null;
  try {
    const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    const clean = urlStr.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
    return clean.split("/")[0].split("?")[0] || null;
  }
}

/**
 * Normalizes phone numbers (handles Indian numbers, digits only, +91).
 */
export function normalizePhone(phoneStr) {
  if (!phoneStr) return null;
  const digits = phoneStr.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  } else if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  } else if (digits.length > 6) {
    return `+${digits}`;
  }
  return phoneStr.trim().toLowerCase();
}

/**
 * Normalizes APK package names.
 */
export function normalizePackageName(pkgStr) {
  if (!pkgStr) return null;
  return pkgStr.trim().toLowerCase();
}

/**
 * Extracts possible threat signatures from a submission.
 */
export function extractSignatures({
  submission_type,
  raw_url,
  qr_decoded_payload,
  apk_package_name,
  apk_filename,
  sender_id,
  raw_text,
}) {
  const signatures = [];

  // Domain from URL or QR payload
  if (raw_url) {
    const domain = normalizeDomain(raw_url);
    if (domain) signatures.push(domain);
  }
  if (qr_decoded_payload) {
    const domain = normalizeDomain(qr_decoded_payload);
    if (domain) signatures.push(domain);
  }

  // Sender ID (phone number or brand spoof)
  if (sender_id) {
    const phone = normalizePhone(sender_id);
    if (phone) signatures.push(phone);
    signatures.push(sender_id.trim().toLowerCase());
  }

  // APK package name or filename
  if (apk_package_name) {
    signatures.push(normalizePackageName(apk_package_name));
  }
  if (apk_filename) {
    signatures.push(apk_filename.trim().toLowerCase());
  }

  // Extract phone numbers or URLs from raw text
  if (raw_text) {
    // Check for phone numbers
    const phoneMatches = raw_text.match(/(?:\+91|91)?\s?[6789]\d{9}/g);
    if (phoneMatches) {
      phoneMatches.forEach(p => {
        const norm = normalizePhone(p);
        if (norm) signatures.push(norm);
      });
    }

    // Check for URLs
    const urlMatches = raw_text.match(/https?:\/\/[^\s]+/g);
    if (urlMatches) {
      urlMatches.forEach(u => {
        const d = normalizeDomain(u);
        if (d) signatures.push(d);
      });
    }
  }

  return [...new Set(signatures.filter(Boolean))];
}

/**
 * Checks community threat database for any match and returns match info.
 */
export async function checkCommunityThreat(submissionPayload) {
  const signatures = extractSignatures(submissionPayload);
  if (signatures.length === 0) {
    return {
      hasMatch: false,
      matchInfo: "No matching threat signatures found in community database.",
      threat: null,
      boost: 0,
    };
  }

  const match = await dbService.findThreatMatch(signatures);
  if (match) {
    const boost = Math.min(25, match.total_reports * 5);
    return {
      hasMatch: true,
      matchInfo: `ALERT: This signature (${match.signature}) was previously reported ${match.total_reports} times with category "${match.scam_category}" and peak risk score ${match.highest_risk_score}/100.`,
      threat: match,
      boost,
      totalReports: match.total_reports,
    };
  }

  return {
    hasMatch: false,
    matchInfo: "No matching threat signatures found in community database.",
    threat: null,
    boost: 0,
  };
}

// server/middleware/adminOnly.middleware.js
import { dbService } from "../services/supabase.service.js";

/**
 * Middleware that strictly gates routes to users with role === 'admin'.
 * Re-queries the profile from the database to guarantee role integrity.
 */
export async function adminOnly(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to access administrative operations.",
      },
    });
  }

  try {
    const profile = await dbService.getProfile(req.user.id);
    if (!profile || profile.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Access denied. Administrator privileges are strictly required.",
        },
      });
    }

    req.user.role = "admin";
    next();
  } catch (error) {
    console.error("Admin check failed:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "ROLE_CHECK_ERROR",
        message: "Failed to verify administrative role authorization.",
      },
    });
  }
}

// server/middleware/auth.middleware.js
import { supabaseAdmin, isSupabaseConfigured, dbService } from "../services/supabase.service.js";

/**
 * Middleware that extracts and validates the Supabase auth session token.
 * Populates req.user if a valid token is provided.
 * If requireAuth is true, halts with 401 if missing/invalid.
 */
export function authenticateUser({ requireAuth = false } = {}) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        if (requireAuth) {
          return res.status(401).json({
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: "Authentication token is required to access this resource.",
            },
          });
        }
        req.user = null;
        return next();
      }

      const token = authHeader.split(" ")[1];

      // If Supabase is configured, verify JWT via Supabase client
      if (isSupabaseConfigured) {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !user) {
          if (requireAuth) {
            return res.status(401).json({
              success: false,
              error: {
                code: "INVALID_TOKEN",
                message: "Provided authentication session is invalid or expired.",
              },
            });
          }
          req.user = null;
          return next();
        }

        const profile = await dbService.getProfile(user.id);
        req.user = {
          id: user.id,
          email: user.email,
          role: profile?.role || "user",
          displayName: profile?.display_name || user.email?.split("@")[0],
          preferredLanguage: profile?.preferred_language || "en",
        };
        return next();
      }

      // Offline / Local Dev token handling
      if (token === "mock-admin-token") {
        req.user = {
          id: "00000000-0000-0000-0000-000000000001",
          email: "admin@scamshield.local",
          role: "admin",
          displayName: "Admin Moderator",
          preferredLanguage: "en",
        };
        return next();
      }

      if (token.startsWith("mock-user-token")) {
        req.user = {
          id: "00000000-0000-0000-0000-000000000002",
          email: "user@scamshield.local",
          role: "user",
          displayName: "Active Citizen",
          preferredLanguage: "en",
        };
        return next();
      }

      // Default anonymous/unknown token in dev mode
      if (requireAuth) {
        return res.status(401).json({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication is required.",
          },
        });
      }

      req.user = null;
      return next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      if (requireAuth) {
        return res.status(500).json({
          success: false,
          error: {
            code: "AUTH_SERVER_ERROR",
            message: "Internal error verifying authentication credentials.",
          },
        });
      }
      req.user = null;
      next();
    }
  };
}

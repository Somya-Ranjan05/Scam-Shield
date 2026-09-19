// server/middleware/rateLimit.middleware.js
import rateLimit from "express-rate-limit";

export const aiSubmissionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many fraud scan requests from this IP address. Please try again after 15 minutes.",
    },
  },
});

export const generalRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please slow down.",
    },
  },
});

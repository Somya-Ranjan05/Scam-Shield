// server/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import submissionsRouter from "./routes/submissions.routes.js";
import reportsRouter from "./routes/reports.routes.js";
import registryRouter from "./routes/registry.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import adminRouter from "./routes/admin.routes.js";
import statsRouter from "./routes/stats.routes.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { generalRateLimiter } from "./middleware/rateLimit.middleware.js";

dotenv.config();

const app = express();

// Security and CORS middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. server-to-server, mobile, curl)
    if (!origin) return callback(null, true);

    // Allow all vercel.app deployments (including preview URLs), localhost, or custom domain
    if (
      origin.endsWith(".vercel.app") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      (process.env.CORS_ORIGIN && (origin === process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === "*"))
    ) {
      return callback(null, true);
    }

    // Reflect origin for permissive browser access in production
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

app.options("*", cors());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// General Rate Limiting
app.use("/api", generalRateLimiter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ScamShield Security Engine",
    timestamp: new Date().toISOString(),
  });
});

// Mount Feature Routes
app.use("/api/submissions", submissionsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/registry", registryRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stats", statsRouter);

// 404 Route Handler
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `API endpoint '${req.originalUrl}' does not exist.`,
    },
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;

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

const allowedOrigins = [
  process.env.CORS_ORIGIN || "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl) or allowed origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation: Origin not allowed"));
    }
  },
  credentials: true,
}));

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

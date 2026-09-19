// server/routes/reports.routes.js
import { Router } from "express";
import { reportsController } from "../controllers/reports.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

// Create community scam report (Requires Auth)
router.post(
  "/",
  authenticateUser({ requireAuth: true }),
  reportsController.createReport
);

export default router;

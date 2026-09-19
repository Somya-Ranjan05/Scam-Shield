// server/routes/dashboard.routes.js
import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

// User scan and report history (Requires Auth)
router.get(
  "/history",
  authenticateUser({ requireAuth: true }),
  dashboardController.getHistory
);

export default router;

// server/routes/admin.routes.js
import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js";

const router = Router();

// Apply auth and adminOnly middleware to all admin routes
router.use(authenticateUser({ requireAuth: true }));
router.use(adminOnly);

// List pending reports
router.get("/reports/pending", adminController.getPendingReports);

// Update status of report (approve/reject/verify)
router.patch("/reports/:id/status", adminController.updateStatus);

export default router;

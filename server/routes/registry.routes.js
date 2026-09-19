// server/routes/registry.routes.js
import { Router } from "express";
import { registryController } from "../controllers/registry.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

// Public scam registry list (Searchable, paginated)
router.get("/", registryController.listReports);

// Single scam report detail
router.get(
  "/:id",
  authenticateUser({ requireAuth: false }),
  registryController.getReportById
);

export default router;

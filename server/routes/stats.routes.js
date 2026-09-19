// server/routes/stats.routes.js
import { Router } from "express";
import { statsController } from "../controllers/stats.controller.js";

const router = Router();

// Public live statistics for landing page
router.get("/live", statsController.getLiveStats);

export default router;

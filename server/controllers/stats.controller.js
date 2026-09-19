// server/controllers/stats.controller.js
import { dbService } from "../services/supabase.service.js";

export const statsController = {
  // Live aggregate stats for landing page
  async getLiveStats(req, res, next) {
    try {
      const stats = await dbService.getLiveStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  },
};

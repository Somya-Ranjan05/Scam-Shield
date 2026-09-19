// server/controllers/dashboard.controller.js
import { dbService } from "../services/supabase.service.js";

export const dashboardController = {
  // Authenticated user's past submission history
  async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0, riskTier, submissionType } = req.query;

      const history = await dbService.getUserSubmissions(userId, {
        limit: Math.min(100, Math.max(1, parseInt(limit, 10) || 20)),
        offset: Math.max(0, parseInt(offset, 10) || 0),
        riskTier,
        submissionType,
      });

      res.json({
        success: true,
        data: history,
      });
    } catch (err) {
      next(err);
    }
  },
};

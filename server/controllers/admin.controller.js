// server/controllers/admin.controller.js
import { updateReportStatusSchema } from "../schemas/reportSchemas.js";
import { dbService } from "../services/supabase.service.js";

export const adminController = {
  // List pending reports awaiting moderation
  async getPendingReports(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await dbService.getPendingReports({
        page: Math.max(1, parseInt(page, 10) || 1),
        limit: Math.min(50, Math.max(1, parseInt(limit, 10) || 20)),
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  // Update status of a report (approve/reject/verify)
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const validated = updateReportStatusSchema.parse(req.body);
      const adminUserId = req.user.id;

      const updated = await dbService.updateReportStatus(id, {
        status: validated.status,
        reviewedBy: adminUserId,
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: {
            code: "REPORT_NOT_FOUND",
            message: "Scam report not found.",
          },
        });
      }

      res.json({
        success: true,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },
};

// server/controllers/registry.controller.js
import { dbService } from "../services/supabase.service.js";

export const registryController = {
  // Public paginated & searchable registry
  async listReports(req, res, next) {
    try {
      const { search = "", category = "all", page = 1, limit = 12 } = req.query;

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

      const result = await dbService.getPublicReports({
        search,
        category,
        page: pageNum,
        limit: limitNum,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  // Single public report detail
  async getReportById(req, res, next) {
    try {
      const { id } = req.params;
      const report = await dbService.getReportById(id);

      if (!report) {
        return res.status(404).json({
          success: false,
          error: {
            code: "REPORT_NOT_FOUND",
            message: "The requested threat report was not found.",
          },
        });
      }

      // Security check: Only verified reports are viewable publicly
      if (report.status !== "community_verified" && report.status !== "admin_verified") {
        if (!req.user || (req.user.id !== report.reported_by && req.user.role !== "admin")) {
          return res.status(403).json({
            success: false,
            error: {
              code: "REPORT_PENDING",
              message: "This report is currently undergoing verification review.",
            },
          });
        }
      }

      res.json({
        success: true,
        data: report,
      });
    } catch (err) {
      next(err);
    }
  },
};

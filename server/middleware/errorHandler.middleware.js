// server/middleware/errorHandler.middleware.js
import { ZodError } from "zod";

export function errorHandler(err, req, res, next) {
  console.error("Unhandled Error Caught:", err);

  // Multer errors (file size, unexpected field)
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: {
          code: "FILE_TOO_LARGE",
          message: "Uploaded file exceeds the maximum allowed file size.",
        },
      });
    }
    return res.status(400).json({
      success: false,
      error: {
        code: "UPLOAD_ERROR",
        message: err.message,
      },
    });
  }

  // File type validation errors from multer fileFilter
  if (err.message && err.message.startsWith("INVALID_FILE_TYPE:")) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_FILE_TYPE",
        message: err.message.replace("INVALID_FILE_TYPE: ", ""),
      },
    });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const formatted = err.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: formatted,
        details: err.errors,
      },
    });
  }

  // Custom status errors
  const status = err.status || 500;
  const message = err.message || "An unexpected server error occurred.";
  const code = err.code || "INTERNAL_SERVER_ERROR";

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
    },
  });
}

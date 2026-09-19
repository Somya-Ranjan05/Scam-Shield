// client/src/lib/apiClient.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * Universal typed API request helper.
 */
export async function apiRequest(endpoint, { method = "GET", body = null, token = null, isFormData = false } = {}) {
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    // Check localStorage fallback for saved mock/offline dev token
    const savedToken = localStorage.getItem("scamshield_token");
    if (savedToken) {
      headers["Authorization"] = `Bearer ${savedToken}`;
    }
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const response = await fetch(url, config);
  const json = await response.json().catch(() => ({
    success: false,
    error: { code: "INVALID_JSON_RESPONSE", message: "Server returned non-JSON response" },
  }));

  if (!response.ok || json.success === false) {
    const errorMsg = json?.error?.message || `HTTP ${response.status}: Request failed`;
    const err = new Error(errorMsg);
    err.code = json?.error?.code || "API_ERROR";
    err.status = response.status;
    err.details = json?.error?.details;
    throw err;
  }

  return json.data;
}

export const api = {
  // Submissions
  submitText: (data, token) => apiRequest("/submissions/text", { method: "POST", body: data, token }),
  submitLink: (data, token) => apiRequest("/submissions/link", { method: "POST", body: data, token }),
  submitQr: (formData, token) => apiRequest("/submissions/qr", { method: "POST", body: formData, token, isFormData: true }),
  submitVoice: (formData, token) => apiRequest("/submissions/voice", { method: "POST", body: formData, token, isFormData: true }),
  submitApk: (data, token) => apiRequest("/submissions/apk", { method: "POST", body: data, token }),
  getSubmission: (id, token) => apiRequest(`/submissions/${id}`, { method: "GET", token }),

  // Reports & Registry
  createReport: (data, token) => apiRequest("/reports", { method: "POST", body: data, token }),
  getRegistryReports: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/registry${query ? `?${query}` : ""}`);
  },
  getRegistryReportById: (id, token) => apiRequest(`/registry/${id}`, { method: "GET", token }),

  // Dashboard & History
  getDashboardHistory: (params = {}, token) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/dashboard/history${query ? `?${query}` : ""}`, { method: "GET", token });
  },

  // Admin
  getPendingReports: (params = {}, token) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/reports/pending${query ? `?${query}` : ""}`, { method: "GET", token });
  },
  updateReportStatus: (id, status, token) =>
    apiRequest(`/admin/reports/${id}/status`, { method: "PATCH", body: { status }, token }),

  // Live Stats
  getLiveStats: () => apiRequest("/stats/live"),
};

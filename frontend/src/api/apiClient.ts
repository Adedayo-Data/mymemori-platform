import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Always add auth token if available
    // Backend will check for BOTH token (authenticated) and X-Session-Id (guest)
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      config.headers["X-Session-Id"] = sessionId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.warn("API Error:", error?.response?.status, error?.config?.url);
    }
    
    // Only auto-logout on 401 from protected endpoints (not /api/public/* or /api/auth/*)
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isPublicEndpoint = url.includes("/api/public/");
      const isAuthEndpoint = url.includes("/api/auth/");
      const isAlreadyOnAuthPage = window.location.pathname.startsWith("/auth");
      
      if (!isPublicEndpoint && !isAuthEndpoint && !isAlreadyOnAuthPage) {
        // Token expired or invalid, clear auth data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("sessionId");
        window.location.href = "/auth";
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

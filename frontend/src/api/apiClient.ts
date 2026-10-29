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
    console.log("API Error:", error);
    console.log("Error response:", error.response);
    console.log("Error status:", error.response?.status);
    
    // Only auto-logout on 401 from protected endpoints (not /api/public/* or /api/auth/*)
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isPublicEndpoint = url.includes("/api/public/");
      const isAuthEndpoint = url.includes("/api/auth/");
      const isAlreadyOnAuthPage = window.location.pathname.startsWith("/auth");
      
      if (!isPublicEndpoint && !isAuthEndpoint && !isAlreadyOnAuthPage) {
        console.log("401 error on protected endpoint, clearing auth data");
        // Token expired or invalid, clear auth data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("sessionId");
        window.location.href = "/auth";
      } else {
        console.log("401 error on public/auth endpoint or already on auth page, letting component handle it");
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

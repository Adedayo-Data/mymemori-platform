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
    
    // Only auto-logout on 401 from protected endpoints (not /api/public/*)
    if (error.response?.status === 401) {
      const isPublicEndpoint = error.config?.url?.includes("/api/public/");
      
      if (!isPublicEndpoint) {
        console.log("401 error on protected endpoint, clearing auth data");
        // Token expired or invalid, clear auth data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("sessionId");
        window.location.href = "/auth";
      } else {
        console.log("401 error on public endpoint, not logging out");
        // For public endpoints, 401 might mean invalid session, not invalid auth
        // Don't auto-logout, let the component handle it
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

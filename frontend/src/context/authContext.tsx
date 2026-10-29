import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { getOrCreateSession, clearSession } from "../utils/sessionUtils";
import { handleApiError } from "../utils/errorUtils";

interface User {
  email: string;
  fullName: string;
}

interface SessionContext {
  isAuthenticated: boolean;
  sessionId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signin: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  getUserDisplayInfo: () => { fullname: string; email: string } | null;
  getSessionContext: (
    searchParams: URLSearchParams,
    state?: any
  ) => Promise<SessionContext>;
}

const AuthContext = createContext < AuthContextType | null > (null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState < User | null > (null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState < string | null > (null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        try {
          // Optional: Verify the token with the server
          // await apiClient.get("/api/auth/verify-token");
          setUser(JSON.parse(userData) as User);
        } catch (error) {
          console.error("Failed to verify authentication:", error);
          // Clear invalid auth data
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
        }
      }
      // Always set loading to false after checking auth state
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Get or create session context for guest users
  const getSessionContext = async (
    searchParams: URLSearchParams,
    state?: any
  ) => {
    // For authenticated users, backend will identify them from JWT token
    if (isAuthenticated) {
      return { isAuthenticated: true };
    }

    // Check if user is currently authenticating (has token but user state not yet set)
    // This prevents session creation during the sign up/sign in process
    const hasAuthToken = !!localStorage.getItem("authToken");
    if (hasAuthToken) {
      // User is authenticated but state hasn't updated yet
      return { isAuthenticated: true };
    }
    const slug = searchParams.get("event") || state?.slug;
    if (!slug) {
      throw new Error("Event slug is required");
    }

    try {
      // Get session from URL, state, or localStorage, or create new one
      const sessionId =
        searchParams.get("session") ||
        state?.sessionId ||
        (await getOrCreateSession(slug));

      return { isAuthenticated: false, sessionId };
    } catch (error) {
      console.error("Failed to get or create session:", error);
      throw error;
    }
  };

  const signup = async (data: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      // Get current session ID if it exists (for session conversion)
      const sessionId = localStorage.getItem("sessionId");

      // Include sessionId in signup request if available
      const signupData = {
        ...data,
        sessionId: sessionId || undefined,
      };

      const response = await apiClient.post("/api/auth/sign-up", signupData);
      const { token, email, fullName } = response.data;
      const userData = { email, fullName };

      // Store auth data
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));

      // CRITICAL: Clear session storage after successful signup
      // Authenticated users should be tracked via JWT only
      clearSession();

      setUser(userData);
    } catch (err: unknown) {
      const errorMessage = handleApiError(
        err,
        "Signup failed. Please try again.",
        { showToast: true, setError }
      );
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/api/auth/sign-in", data);
      const { token, email, fullName } = response.data;
      const userData = { email, fullName };
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
    } catch (err: unknown) {
      const errorMessage = handleApiError(
        err,
        "Signin failed. Please check your credentials.",
        { showToast: true, setError }
      );
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    clearSession(); // Also clear guest session
    setUser(null);
    setError(null);
  };

  const getUserDisplayInfo = () => {
    if (!user) return null;
    return {
      fullname: user.fullName,
      email: user.email,
    };
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    isLoading: loading,
    signup,
    signin,
    logout,
    getUserDisplayInfo,
    getSessionContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

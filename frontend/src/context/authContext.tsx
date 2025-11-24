import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";

interface User {
  id?: string;
  email: string;
  fullName: string;
}

interface SessionContext {
  isAuthenticated: boolean;
  userId?: string;
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

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    if (isAuthenticated && user?.id) {
      return { isAuthenticated: true, userId: user.id };
    }

    // Get session from URL, state, or localStorage
    const sessionId =
      searchParams.get("session") ||
      state?.sessionId ||
      localStorage.getItem("sessionId");

    if (!sessionId) {
      const slug = searchParams.get("event") || state?.slug;
      if (slug) {
        // If we have an event slug but no session, create one
        try {
          const response = await apiClient.post("/api/public/create-session", {
            eventSlug: slug,
            deviceType: "web",
          });

          const newSessionId = response.data?.sessionId;
          if (newSessionId) {
            localStorage.setItem("sessionId", newSessionId);
            return { isAuthenticated: false, sessionId: newSessionId };
          }
        } catch (error) {
          console.error("Failed to create session:", error);
          throw error;
        }
      }
      // If we get here, we couldn't get or create a session
      throw new Error("No valid session");
    }

    return { isAuthenticated: false, sessionId };
  };

  const signup = async (data: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/api/auth/sign-up", data);
      const { token, email, fullName } = response.data;
      const userData = { email, fullName };
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
      toast.success("Account created successfully!");
      console.log("Signup response:", response.data);
      console.log("userData:", userData);
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        "Signup failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
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
      toast.success("Signed in successfully!");
      console.log("Signin response:", response.data);
      console.log("userData:", userData);
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        "Signin failed. Please check your credentials.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
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

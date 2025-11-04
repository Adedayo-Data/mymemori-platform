import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";

interface User {
  id?: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signin: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  getUserDisplayInfo: () => { fullname: string; email: string } | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData) as User);
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
  }, []);

  const signup = async (data: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/api/auth/sign-up", data);
      const { token, user: userData } = response.data;
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
    signup,
    signin,
    logout,
    getUserDisplayInfo,
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  validateSignupForm,
  validateSigninForm,
  hasValidationErrors,
} from "../utils/validation";
import type {
  ValidationErrors,
  SignupFormData,
  SigninFormData,
} from "../utils/validation";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signup");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { loading, signup, signin } = useAuth();

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    let validationErrors: ValidationErrors;

    if (activeTab === "signup") {
      validationErrors = validateSignupForm(formData as SignupFormData);
    } else {
      validationErrors = validateSigninForm(formData as SigninFormData);
    }

    setErrors({
      fullName: validationErrors.fullName || "",
      email: validationErrors.email || "",
      password: validationErrors.password || "",
      confirmPassword: validationErrors.confirmPassword || "",
    });

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    try {
      if (activeTab === "signup") {
        await signup({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
      } else {
        await signin({
          email: formData.email,
          password: formData.password,
        });
      }
      navigate("/profile");
    } catch {
      // Error is handled by the context
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Continue with Google clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 tracking-tight">
            MyMemori
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            {activeTab === "signup"
              ? "Create an account to get started on your memories"
              : "Welcome back, log in to view memories"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
              activeTab === "signup"
                ? "bg-white text-pink-600 shadow-md"
                : "bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
              activeTab === "login"
                ? "bg-white text-pink-600 shadow-md"
                : "bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            Log In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === "signup" && (
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
              {errors.fullName && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.fullName}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
            />
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
            />
            {errors.password && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.password}</p>
            )}
          </div>

          {activeTab === "signup" && (
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {activeTab === "login" && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-pink-600 hover:text-pink-700 font-bold transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-pink-300 disabled:to-rose-300 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {loading
              ? "Loading..."
              : activeTab === "signup"
              ? "Create Account"
              : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-7">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all font-bold text-gray-700"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Auth;

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
    <div className="min-h-screen bg-linear-to-br from-rose-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            myMemori
          </h1>
          <p className="text-gray-500">
            {activeTab === "signup"
              ? "Create an account to get started on your memories"
              : "Welcome back log in to view memories"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-50 p-2 rounded-lg">
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === "signup"
                ? "bg-rose-100 text-rose-700"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === "login"
                ? "bg-rose-100 text-rose-700"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Log In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
              {errors.fullName && (
                <p className="text-sm text-rose-600 mt-1">{errors.fullName}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
            {errors.email && (
              <p className="text-sm text-rose-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
            {errors.password && (
              <p className="text-sm text-rose-600 mt-1">{errors.password}</p>
            )}
          </div>

          {activeTab === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-rose-600 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {activeTab === "login" && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-rose-500 hover:text-rose-600 font-medium"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-400 hover:bg-rose-500 disabled:bg-rose-300 text-white font-medium py-3 rounded-lg transition-colors shadow-sm"
          >
            {loading
              ? "Loading..."
              : activeTab === "signup"
              ? "Create Account"
              : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>
      </div>
    </div>
  );
};

export default Auth;

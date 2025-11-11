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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 tracking-tight">
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
                <p className="text-xs text-rose-600 mt-1.5 font-medium">
                  {errors.fullName}
                </p>
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
              <p className="text-xs text-rose-600 mt-1.5 font-medium">
                {errors.email}
              </p>
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
              <p className="text-xs text-rose-600 mt-1.5 font-medium">
                {errors.password}
              </p>
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
            className="w-full bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-pink-300 disabled:to-rose-300 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
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
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            or
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all font-bold text-gray-700"
        >
          <img src="/assets/google.svg" alt="GoogleIcon" className="w-4 h-4" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Auth;

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
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const navigate = useNavigate();
  const { loading, signup, signin } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let validationErrors: ValidationErrors;

    if (activeTab === "signup") {
      validationErrors = validateSignupForm(formData as SignupFormData);
    } else {
      validationErrors = validateSigninForm(formData as SigninFormData);
    }

    setErrors(validationErrors);

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
        toast.success("Account created successfully!");
      } else {
        await signin({
          email: formData.email,
          password: formData.password,
        });
        toast.success("Welcome back!");
      }
      navigate("/profile");
    } catch (error) {
      console.error(error);
      // Error is handled by the context/toast
    }
  };

  const handleGoogleSignIn = () => {
    toast.success("Google Sign In coming soon!");
  };

  const toggleTab = (tab: "signup" | "login") => {
    setActiveTab(tab);
    setErrors({ fullName: "", email: "", password: "", confirmPassword: "" });
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-orange-50 to-pink-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/50 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            layoutId="title"
            className="text-4xl font-black bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 tracking-tight"
          >
            MyMemori
          </motion.h1>
          <motion.p 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-600 font-medium"
          >
            {activeTab === "signup"
              ? "Create an account to capture your moments"
              : "Welcome back! Sign in to view your memories"}
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-xl backdrop-blur-sm">
          {(["signup", "login"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => toggleTab(tab)}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all relative ${
                activeTab === tab
                  ? "text-pink-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {tab === "signup" ? "Sign Up" : "Log In"}
              </span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "signup" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "signup" ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {activeTab === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all bg-gray-50/50 focus:bg-white ${
                        errors.fullName ? "border-rose-300 focus:border-rose-500" : "border-gray-200 focus:border-pink-500"
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-rose-600 mt-1.5 font-medium ml-1">
                      {errors.fullName}
                    </motion.p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all bg-gray-50/50 focus:bg-white ${
                      errors.email ? "border-rose-300 focus:border-rose-500" : "border-gray-200 focus:border-pink-500"
                    }`}
                  />
                </div>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-rose-600 mt-1.5 font-medium ml-1">
                    {errors.email}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all bg-gray-50/50 focus:bg-white ${
                      errors.password ? "border-rose-300 focus:border-rose-500" : "border-gray-200 focus:border-pink-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-rose-600 mt-1.5 font-medium ml-1">
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {activeTab === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all bg-gray-50/50 focus:bg-white ${
                        errors.confirmPassword ? "border-rose-300 focus:border-rose-500" : "border-gray-200 focus:border-pink-500"
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-rose-600 mt-1.5 font-medium ml-1">
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {activeTab === "login" && (
            <div className="text-right">
              <button
                type="button"
                className="text-xs text-pink-600 hover:text-pink-700 font-bold transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-pink-300 disabled:to-rose-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:shadow-none disabled:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{activeTab === "signup" ? "Create Account" : "Log In"}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            or continue with
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:border-pink-200 hover:bg-pink-50/50 transition-all font-bold text-gray-700 group bg-white"
        >
          <img src="/assets/google.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Google</span>
        </button>
      </motion.div>
    </div>
  );
};

export default Auth;

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import toast from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const returnTo = searchParams.get("returnTo");

  const [activeTab, setActiveTab] = useState<"signup" | "login">(
    mode === "signup" ? "signup" : "login"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { signup, signin, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      const redirectUrl = returnTo && returnTo !== "/" ? returnTo : "/home";
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, isLoading, returnTo, navigate]);

  useEffect(() => {
    if (mode === "signup" || mode === "login") {
      setActiveTab(mode);
    }
  }, [mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password' && activeTab === 'signup') {
      let passwordError = '';
      if (!value) passwordError = 'Password is required';
      else if (value.length < 8) passwordError = 'Password must be at least 8 characters';
      else if (!/(?=.*[a-z])/.test(value)) passwordError = 'Password must contain at least one lowercase letter';
      else if (!/(?=.*[A-Z])/.test(value)) passwordError = 'Password must contain at least one uppercase letter';
      else if (!/(?=.*\d)/.test(value)) passwordError = 'Password must contain at least one number';
      setErrors((prev) => ({ ...prev, password: passwordError }));
    } else {
      if (errors[name as keyof ValidationErrors]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
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
      const firstError = Object.values(validationErrors).find((err) => !!err);
      if (firstError) toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
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
      const redirectUrl = returnTo && returnTo !== "/" ? returnTo : "/home";
      navigate(redirectUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTab = (tab: "signup" | "login") => {
    setActiveTab(tab);
    setErrors({ fullName: "", email: "", password: "" });
    setFormData({ fullName: "", email: "", password: "" });
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("mode", tab);
        return next;
      },
      { replace: true }
    );
  };

  return (
    <div className="antialiased h-screen flex flex-col relative overflow-hidden bg-background text-on-surface">
      {/* Ambient Glows */}
      <div className="auth-ambient-glow top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
      <div
        className="auth-ambient-glow bottom-0 right-0 translate-x-1/3 translate-y-1/3"
        style={{ background: "radial-gradient(circle, rgba(221, 183, 255, 0.15) 0%, rgba(221, 183, 255, 0) 70%)" }}
      ></div>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-[35px] px-[20px] flex flex-col items-center justify-center relative z-10 w-full max-w-[500px] mx-auto">
        <div className="w-full rounded-xl p-[24px] flex flex-col gap-[24px] relative overflow-hidden md:bg-white/5 md:backdrop-blur-xl md:border md:border-white/10">
          {/* Header */}

          <div className="text-center space-y-sm">
            <div className="flex items-center gap-2 justify-center mb-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden glass-2-0 p-1 flex items-center justify-center">
                <img alt="MyMemori" className="w-full h-full object-contain mix-blend-screen" src="logo.png" />
              </div>
            </div>  
            <h1 className="font-sora text-xl font-semibold text-on-surface transition-all duration-300">
              {activeTab === 'login' ? 'Welcome Back' : 'First Time Here?'}
            </h1>
            <p className="font-hanken text-base text-on-surface-variant transition-all duration-300">
              {activeTab === 'login'
                ? 'Good to see you again! Sign in to continue.'
                : 'Create an account to start capturing your moments.'}
            </p>
          </div>

          {/* Custom Tabs */}
          <div className="relative flex w-full p-1 bg-surface-container-low rounded-lg">
            <div
              className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-md shadow-sm auth-tab-indicator border border-white/5"
              style={{ transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)' }}
            ></div>
            <button
              className={`relative z-10 flex-1 py-2 font-hanken text-sm font-semibold transition-colors ${activeTab === 'login' ? 'text-primary' : 'text-on-surface-variant'}`}
              onClick={() => toggleTab('login')}
            >
              Login
            </button>
            <button
              className={`relative z-10 flex-1 py-2 font-hanken text-sm font-semibold transition-colors ${activeTab === 'signup' ? 'text-primary' : 'text-on-surface-variant'}`}
              onClick={() => toggleTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Forms Container */}
          <div className="relative w-full h-[320px]">
            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className={`absolute inset-0 flex flex-col gap-[16px] transition-opacity duration-300 ${activeTab === 'login' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
            >
              <div className="flex flex-col gap-[4px] auth-input-glow group rounded-t-md bg-white/5 border-b border-white/20 transition-all duration-300 p-[8px] px-[16px]">
                <label className="font-hanken font-semibold text-[10px] uppercase text-on-surface-variant/70 tracking-wider">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-transparent border-none p-0 focus:ring-0 font-hanken text-base text-on-surface placeholder-on-surface-variant/30 w-full outline-none"
                  placeholder="phantom@night.city"
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-[4px] auth-input-glow group rounded-t-md bg-white/5 border-b border-white/20 transition-all duration-300 p-[8px] px-[16px] relative">
                <label className="font-hanken font-semibold text-[10px] uppercase text-on-surface-variant/70 tracking-wider">Password</label>
                <div className="flex justify-between items-center w-full">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-transparent border-none p-0 focus:ring-0 font-hanken text-base text-on-surface placeholder-on-surface-variant/30 w-full outline-none"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-on-surface-variant hover:text-primary transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-sm">{showPassword ? "visibility" : "visibility_off"}</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-end mt-[-8px]">
                <a className="font-hanken text-sm font-semibold text-secondary hover:text-primary transition-colors text-xs" href="#">Forgot password?</a>
              </div>

              {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
              {errors.password && <span className="text-red-400 text-xs">{errors.password}</span>}

              <Button 
                type="submit"
                variant="gradient"
                size="xl"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Welcome Back"}
              </Button>
            </form>

            {/* Sign Up Form */}
            <form
              onSubmit={handleSubmit}
              className={`absolute inset-0 flex flex-col gap-[16px] transition-opacity duration-300 ${activeTab === 'signup' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
            >
              <div className="flex flex-col gap-[4px] auth-input-glow group rounded-t-md bg-white/5 border-b border-white/20 transition-all duration-300 p-[8px] px-[16px]">
                <label className="font-hanken font-semibold text-[10px] uppercase text-on-surface-variant/70 tracking-wider">Username</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="bg-transparent border-none p-0 focus:ring-0 font-hanken text-base text-on-surface placeholder-on-surface-variant/30 w-full outline-none"
                  placeholder="@neon_wanderer"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-[4px] auth-input-glow group rounded-t-md bg-white/5 border-b border-white/20 transition-all duration-300 p-[8px] px-[16px]">
                <label className="font-hanken font-semibold text-[10px] uppercase text-on-surface-variant/70 tracking-wider">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-transparent border-none p-0 focus:ring-0 font-hanken text-base text-on-surface placeholder-on-surface-variant/30 w-full outline-none"
                  placeholder="you@domain.com"
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-[4px] auth-input-glow group rounded-t-md bg-white/5 border-b border-white/20 transition-all duration-300 p-[8px] px-[16px] relative">
                <label className="font-hanken font-semibold text-[10px] uppercase text-on-surface-variant/70 tracking-wider">Password</label>
                <div className="flex justify-between items-center w-full">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-transparent border-none p-0 focus:ring-0 font-hanken text-base text-on-surface placeholder-on-surface-variant/30 w-full outline-none"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-on-surface-variant hover:text-primary transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-sm">{showPassword ? "visibility" : "visibility_off"}</span>
                  </button>
                </div>
              </div>

              {errors.fullName && <span className="text-red-400 text-xs">{errors.fullName}</span>}
              {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
              {errors.password && <span className="text-red-400 text-xs">{errors.password}</span>}

              <Button 
                type="submit"
                variant="gradient"
                size="xl"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "First Time? Get Started"}
              </Button>
            </form>
          </div>

          {/* Social Auth Divider */}
          <div className="flex items-center w-full gap-4 opacity-60">
            <div className="h-px bg-white/20 flex-grow"></div>
            <span className="font-hanken text-sm font-semibold text-on-surface-variant text-xs">or continue with</span>
            <div className="h-px bg-white/20 flex-grow"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              disabled
              title="Coming soon"
              aria-label="Passkey or Biometric sign in (Coming soon)"
              className="w-12 h-12 rounded-full auth-glass-panel border border-white/10 flex items-center justify-center opacity-40 cursor-not-allowed opacity-50"
            >
              <span className="material-symbols-outlined text-on-surface">fingerprint</span>
            </button>
            <button
              type="button"
              disabled
              title="Coming soon"
              aria-label="Continue with Google (Coming soon)"
              className="w-12 h-12 rounded-full auth-glass-panel border border-white/10 flex items-center justify-center opacity-40 cursor-not-allowed opacity-50"
            >
              <FcGoogle className="w-5 h-5 text-xl grayscale-[40%]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;

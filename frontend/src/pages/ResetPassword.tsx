import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import { extractErrorMessage } from "../utils/errorUtils";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read token from URL query param if present
  const urlToken = searchParams.get("token") || searchParams.get("code") || "";

  const [token, setToken] = useState(urlToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedToken = token.trim();
    if (!trimmedToken) {
      const msg = "Reset token or code is missing. Please check your reset link.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!password) {
      const msg = "Please enter your new password";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 8) {
      const msg = "Password must be at least 8 characters long";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!/(?=.*[a-z])/.test(password) || !/(?=.*[A-Z])/.test(password) || !/(?=.*\d)/.test(password)) {
      const msg = "Password must contain uppercase, lowercase letters, and at least one number";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/api/auth/reset-password", {
        token: trimmedToken,
        password: password,
      });

      setIsResetSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      const message = extractErrorMessage(
        error,
        "Failed to reset password. The link or token may have expired."
      );
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#131318] text-[#e4e1e9] min-h-screen flex flex-col items-center justify-center p-[16px] relative overflow-hidden font-body-md selection:bg-primary/30 selection:text-primary-fixed">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] ambient-glow-primary rounded-full mix-blend-screen opacity-50 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] ambient-glow-secondary rounded-full mix-blend-screen opacity-40 blur-3xl transform translate-x-1/4 translate-y-1/4" />
      </div>

      {/* Main Glass Card */}
      <div className="w-full max-w-md auth-card rounded-2xl p-[32px] md:p-[40px] flex flex-col gap-[28px] relative z-10 border-0 md:border md:border-white/10 shadow-none md:shadow-2xl md:backdrop-blur-2xl bg-transparent md:bg-[#1f1f25]/85">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-[8px]">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 p-0.5 shadow-[0_0_25px_rgba(221,183,255,0.3)] mb-2 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[32px] text-[#ddb7ff]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isResetSuccess ? "check_circle" : "key"}
            </span>
          </div>
          <h1 className="font-sora text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            {isResetSuccess ? "Password Reset!" : "Set New Password"}
          </h1>
          <p className="font-hanken text-sm text-on-surface-variant max-w-xs">
            {isResetSuccess
              ? "Your password has been successfully updated. You can now log in with your new credentials."
              : "Create a strong new password to secure your MyMemori account."}
          </p>
        </div>

        {/* Form View */}
        {!isResetSuccess ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
            {/* New Password */}
            <div className="flex flex-col gap-[4px] auth-input-glow group rounded-t-md bg-white/5 border-b border-white/20 transition-all duration-300 p-[10px] px-[16px] relative">
              <label
                htmlFor="password"
                className="font-hanken font-semibold text-[10px] uppercase text-on-surface-variant/70 tracking-wider"
              >
                New Password
              </label>
              <div className="flex justify-between items-center w-full">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  disabled={isSubmitting}
                  className="bg-transparent border-none p-0 focus:ring-0 font-hanken text-base text-on-surface placeholder-on-surface-variant/30 w-full outline-none"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-on-surface-variant hover:text-primary transition-colors p-1 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-sm">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-[4px] auth-input-glow group rounded-t-md bg-white/5 border-b border-white/20 transition-all duration-300 p-[10px] px-[16px] relative">
              <label
                htmlFor="confirmPassword"
                className="font-hanken font-semibold text-[10px] uppercase text-on-surface-variant/70 tracking-wider"
              >
                Confirm New Password
              </label>
              <div className="flex justify-between items-center w-full">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  disabled={isSubmitting}
                  className="bg-transparent border-none p-0 focus:ring-0 font-hanken text-base text-on-surface placeholder-on-surface-variant/30 w-full outline-none"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-on-surface-variant hover:text-primary transition-colors p-1 cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-sm">
                    {showConfirmPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Helper Requirements */}
            <div className="text-[11px] text-on-surface-variant/70 space-y-1 px-1">
              <p>• At least 8 characters long</p>
              <p>• Contains uppercase, lowercase, and numbers</p>
            </div>

            {errorMessage && (
              <span className="text-red-400 text-xs px-1">{errorMessage}</span>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="xl"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting Password..." : "Update Password"}
            </Button>
          </form>
        ) : (
          /* Success View */
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="gradient"
              size="xl"
              fullWidth
              onClick={() => navigate("/auth?mode=login")}
            >
              Log In to MyMemori
            </Button>
          </div>
        )}

        {/* Back to Login Footer */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/10">
          <Link
            to="/auth?mode=login"
            className="font-hanken text-xs font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

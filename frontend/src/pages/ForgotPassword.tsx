import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import { extractErrorMessage } from "../utils/errorUtils";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address");
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/api/auth/forgot-password", { email: trimmedEmail });
      setIsSubmitted(true);
      toast.success("Password reset instructions sent!");
    } catch (error: unknown) {
      console.error("Forgot password error:", error);
      const message = extractErrorMessage(
        error,
        "Unable to send reset instructions. Please check your email and try again."
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
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 p-0.5 shadow-[0_0_25px_rgba(247,81,161,0.3)] mb-2 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[32px] text-[#ffb0cd]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock_reset
            </span>
          </div>
          <h1 className="font-sora text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            {isSubmitted ? "Check Your Email" : "Forgot Password?"}
          </h1>
          <p className="font-hanken text-sm text-on-surface-variant max-w-xs">
            {isSubmitted
              ? `We sent password reset instructions to ${email}. Check your inbox and spam folder.`
              : "No worries! Enter the email address associated with your account, and we'll send you a link to reset your password."}
          </p>
        </div>

        {/* State 1: Form View */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[4px] auth-input-glow group rounded-t-md bg-white/5 border-b border-white/20 transition-all duration-300 p-[10px] px-[16px]">
              <label
                htmlFor="email"
                className="font-hanken font-semibold text-[10px] uppercase text-on-surface-variant/70 tracking-wider"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={isSubmitting}
                className="bg-transparent border-none p-0 focus:ring-0 font-hanken text-base text-on-surface placeholder-on-surface-variant/30 w-full outline-none"
                placeholder="you@domain.com"
                autoComplete="email"
                autoFocus
              />
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
              {isSubmitting ? "Sending Link..." : "Send Reset Link"}
            </Button>
          </form>
        ) : (
          /* State 2: Success Message View */
          <div className="flex flex-col gap-4">
            <div className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
              <span className="text-xs text-[#debec8] leading-relaxed block">
                Didn't receive the email? Check your spam folder or try again in a few minutes.
              </span>
            </div>

            <Button
              type="button"
              variant="gradient"
              size="xl"
              fullWidth
              onClick={() => setIsSubmitted(false)}
            >
              Try Another Email
            </Button>
          </div>
        )}

        {/* Back to Login Footer */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/10">
          <span className="text-xs text-on-surface-variant/70 font-hanken">
            Remembered your password?
          </span>
          <Link
            to="/auth?mode=login"
            className="font-hanken text-xs font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            <span>Back to Sign In</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

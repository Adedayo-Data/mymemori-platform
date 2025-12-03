import apiClient from "../api/apiClient";
import { retryWithBackoff } from "./retryUtils";

/**
 * Creates a new session for GUEST USERS ONLY
 * This should NOT be called for authenticated users during sign up/sign in
 * Sessions are only for anonymous users accessing event galleries
 * @param eventSlug - The event slug to create a session for
 * @returns The session ID
 */
export const createSession = async (eventSlug: string): Promise<string> => {
  const response = await retryWithBackoff(
    async () => {
      const res = await apiClient.post("/api/public/create-session", {
        eventSlug,
        deviceType: "web",
      });
      return res;
    },
    {
      maxRetries: 3,
      baseDelay: 1000,
    }
  );

  const { sessionId } = response.data;
  if (!sessionId) {
    throw new Error("No session ID in response");
  }

  localStorage.setItem("sessionId", sessionId);
  return sessionId;
};

/**
 * Gets existing session or creates a new one
 * @param eventSlug - The event slug
 * @returns The session ID
 */
export const getOrCreateSession = async (
  eventSlug: string
): Promise<string> => {
  const existingSession = localStorage.getItem("sessionId");
  if (existingSession) {
    return existingSession;
  }
  return await createSession(eventSlug);
};

/**
 * Clears the current session from localStorage
 */
export const clearSession = (): void => {
  localStorage.removeItem("sessionId");
};

/**
 * Gets the current session ID from localStorage
 * @returns The session ID or null if not found
 */
export const getCurrentSession = (): string | null => {
  return localStorage.getItem("sessionId");
};

/**
 * Validates if a session is still active
 * @param sessionId - The session ID to validate
 * @param eventSlug - The event slug
 * @returns True if session is valid
 */
export const validateSession = async (
  sessionId: string,
  eventSlug: string
): Promise<boolean> => {
  try {
    await apiClient.get("/api/public/validate-session", {
      params: { eventSlug },
      headers: { "X-Session-Id": sessionId },
    });
    return true;
  } catch (error) {
    return false;
  }
};

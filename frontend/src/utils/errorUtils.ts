import toast from "react-hot-toast";

/**
 * Extracts error message from various error types
 * @param error - The error object
 * @param defaultMessage - Default message if extraction fails
 * @returns The extracted error message
 */
export const extractErrorMessage = (
  error: unknown,
  defaultMessage: string = "An error occurred. Please try again."
): string => {
  let message = "";
  let statusCode: number | undefined;

  // Check for Axios error response
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object"
  ) {
    const response = error.response as any;
    statusCode = response.status;
    const data = response.data;

    if (data && typeof data === "object") {
      if ("message" in data && typeof data.message === "string") {
        message = data.message;
      } else if ("error" in data && typeof data.error === "string") {
        message = data.error;
      } else if ("detail" in data && typeof data.detail === "string") {
        message = data.detail;
      } else if ("errors" in data && Array.isArray(data.errors)) {
        message = data.errors
          .map((e: any) => (typeof e === "string" ? e : e.message || e.msg))
          .filter(Boolean)
          .join(", ");
      }
    } else if (typeof data === "string" && data.trim()) {
      // If the backend returned raw HTML (e.g. 502 Bad Gateway), discard it
      if (!/<[a-z][\s\S]*>/i.test(data)) {
        message = data;
      }
    }
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  // Handle common technical/uninterpreted network and Axios messages
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("network error") || lowerMsg.includes("err_network") || lowerMsg.includes("failed to fetch")) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  if (lowerMsg.includes("timeout") || lowerMsg.includes("econnaborted")) {
    return "The request timed out. Please try again.";
  }

  // If message is just a raw Axios status message like "Request failed with status code 404"
  if (lowerMsg.includes("request failed with status code") || lowerMsg.includes("status code")) {
    const matchedCode = message.match(/\b\d{3}\b/);
    if (matchedCode) {
      statusCode = parseInt(matchedCode[0], 10);
    }
    message = ""; // clear it so status code mapping takes over
  }

  // Map known status codes if no specific user-friendly message was provided by API
  if (!message || message === defaultMessage) {
    if (statusCode === 400) {
      return "Invalid request. Please check the information provided.";
    }
    if (statusCode === 401) {
      return "Your session has expired. Please log in again.";
    }
    if (statusCode === 403) {
      return "You do not have permission to perform this action.";
    }
    if (statusCode === 404) {
      return "The requested event or resource could not be found.";
    }
    if (statusCode === 409) {
      return "This record already exists.";
    }
    if (statusCode === 413) {
      return "The uploaded file is too large. Please choose a smaller photo.";
    }
    if (statusCode === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }
    if (statusCode && statusCode >= 500) {
      return "Our servers encountered an unexpected issue. Please try again shortly.";
    }
  }

  // Clean up any remaining status code patterns from message
  message = message
    .replace(/\bStatus Code:\s*\d{3}\b/gi, "")
    .replace(/\bStatus:\s*\d{3}\b/gi, "")
    .replace(/\bstatus code\s*\d{3}\b/gi, "")
    .replace(/\[\d{3}\]/g, "")
    .replace(/\(\d{3}\)/g, "")
    .replace(/\b\d{3}\s*-\s*/g, "")
    .replace(/\s*-\s*\d{3}\b/g, "")
    .trim();

  // Remove any leading/trailing punctuation left over
  message = message.replace(/^[:\-\s]+|[:\-\s]+$/g, "").trim();

  return message || defaultMessage;
};

/**
 * Options for handling API errors
 */
export interface ErrorHandlingOptions {
  showToast?: boolean;
  setError?: (message: string) => void;
  onError?: (error: unknown) => void;
}

/**
 * Handles API errors with consistent error extraction and optional toast/state updates
 * @param error - The error to handle
 * @param defaultMessage - Default error message
 * @param options - Error handling options
 * @returns The extracted error message
 */
export const handleApiError = (
  error: unknown,
  defaultMessage: string,
  options: ErrorHandlingOptions = {}
): string => {
  const { showToast = true, setError, onError } = options;

  const message = extractErrorMessage(error, defaultMessage);

  // Show toast notification if enabled
  if (showToast) {
    toast.error(message);
  }

  // Update error state if setter provided
  if (setError) {
    setError(message);
  }

  // Call custom error handler if provided
  if (onError) {
    onError(error);
  }

  return message;
};

/**
 * Wraps an async function with automatic error handling
 * @param fn - The async function to wrap
 * @param defaultMessage - Default error message
 * @param options - Error handling options
 * @returns A wrapped function with error handling
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  defaultMessage: string,
  options: ErrorHandlingOptions = {}
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, defaultMessage, options);
      throw error;
    }
  }) as T;
};

/**
 * Creates a standardized error object
 * @param message - Error message
 * @returns Error object
 */
export const createError = (message: string): Error => {
  const error = new Error(message);
  return error;
};

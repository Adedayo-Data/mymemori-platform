import toast from "react-hot-toast";

/**
 * Extracts error message from various error types
 * @param error - The error object
 * @param defaultMessage - Default message if extraction fails
 * @returns The extracted error message
 */
export const extractErrorMessage = (
  error: unknown,
  defaultMessage: string = "An error occurred"
): string => {
  let message = defaultMessage;
  // Check for Axios error response
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const data = (error.response as any).data;
    if (data && typeof data === "object" && "message" in data) {
      message = data.message;
    }
  }
  // Check for Error instance
  else if (error instanceof Error) {
    message = error.message;
  }
  // Check for string error
  else if (typeof error === "string") {
    message = error;
  }

  // Clean up the message by removing status codes
  // Remove patterns like "Status Code: 400", "Status: 500", "[400]", "(404)", etc.
  message = message
    .replace(/\bStatus Code:\s*\d{3}\b/gi, "")
    .replace(/\bStatus:\s*\d{3}\b/gi, "")
    .replace(/\[\d{3}\]/g, "")
    .replace(/\(\d{3}\)/g, "")
    .replace(/\b\d{3}\s*-\s*/g, "")
    .replace(/\s*-\s*\d{3}\b/g, "")
    .trim();

  // Remove any leading/trailing punctuation that might be left over
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

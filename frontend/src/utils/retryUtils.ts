/**
 * Retry options for async operations
 */
export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  onRetry?: (attempt: number, error: unknown) => void;
}

/**
 * Executes an async function with exponential backoff retry logic
 * @param fn - The async function to execute
 * @param options - Retry configuration options
 * @returns The result of the async function
 * @throws The last error if all retries fail
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const { maxRetries = 3, baseDelay = 1000, onRetry } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * (attempt + 1);

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, error);
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError;
};

/**
 * Wraps a function to automatically retry on failure
 * @param fn - The function to wrap
 * @param options - Retry configuration options
 * @returns A wrapped function with retry logic
 */
export const withRetry = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
): T => {
  return ((...args: Parameters<T>) => {
    return retryWithBackoff(() => fn(...args), options);
  }) as T;
};

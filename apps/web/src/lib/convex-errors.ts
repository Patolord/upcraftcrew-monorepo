import { ConvexError } from "convex/values";

/**
 * Error codes matching the backend error types
 */
export type ErrorCode =
  | "UNAUTHENTICATED"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "ALREADY_EXISTS"
  | "VALIDATION_ERROR"
  | "FORBIDDEN";

/**
 * Structured error data from Convex backend
 */
export type AppError = {
  code: ErrorCode;
  message: string;
  resource?: string;
  field?: string;
};

/**
 * Type guard to check if an error is a ConvexError
 */
export function isConvexError(error: unknown): error is ConvexError<AppError> {
  return error instanceof ConvexError;
}

/**
 * Extract error data from a ConvexError
 * Returns null if not a ConvexError
 */
export function getErrorData(error: unknown): AppError | null {
  if (isConvexError(error)) {
    return error.data as AppError;
  }
  return null;
}

/**
 * Check if error is a critical error that requires special handling
 * (authentication/authorization errors)
 */
export function isCriticalError(error: unknown): boolean {
  const data = getErrorData(error);
  if (!data) return false;
  return (
    data.code === "UNAUTHENTICATED" || data.code === "UNAUTHORIZED" || data.code === "FORBIDDEN"
  );
}

/**
 * Check if error is a "not found" error
 */
export function isNotFoundError(error: unknown): boolean {
  const data = getErrorData(error);
  return data?.code === "NOT_FOUND";
}

/**
 * Check if error is an "already exists" error
 */
export function isAlreadyExistsError(error: unknown): boolean {
  const data = getErrorData(error);
  return data?.code === "ALREADY_EXISTS";
}

/**
 * Get a user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  const data = getErrorData(error);
  if (data) {
    return data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

/**
 * Get the error code if available
 */
export function getErrorCode(error: unknown): ErrorCode | null {
  const data = getErrorData(error);
  return data?.code || null;
}

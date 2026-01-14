import { ConvexError } from "convex/values";

/**
 * Error codes for application errors
 * These codes allow the frontend to identify and handle specific error types
 */
export type ErrorCode =
  | "UNAUTHENTICATED"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "ALREADY_EXISTS"
  | "VALIDATION_ERROR"
  | "FORBIDDEN";

/**
 * Structured error data that gets transported to the frontend
 */
export type AppError = {
  code: ErrorCode;
  message: string;
  resource?: string;
  field?: string;
};

/**
 * Throw when user is not authenticated (not logged in)
 */
export function throwUnauthenticated(message?: string): never {
  throw new ConvexError<AppError>({
    code: "UNAUTHENTICATED",
    message: message || "Authentication required",
  });
}

/**
 * Throw when user doesn't have required permissions
 */
export function throwUnauthorized(message?: string): never {
  throw new ConvexError<AppError>({
    code: "UNAUTHORIZED",
    message: message || "You don't have permission to perform this action",
  });
}

/**
 * Throw when user is authenticated but action is forbidden
 */
export function throwForbidden(message?: string): never {
  throw new ConvexError<AppError>({
    code: "FORBIDDEN",
    message: message || "This action is forbidden",
  });
}

/**
 * Throw when a resource is not found
 */
export function throwNotFound(resource: string): never {
  throw new ConvexError<AppError>({
    code: "NOT_FOUND",
    message: `${resource} not found`,
    resource,
  });
}

/**
 * Throw when trying to create a resource that already exists
 */
export function throwAlreadyExists(resource: string, field?: string): never {
  throw new ConvexError<AppError>({
    code: "ALREADY_EXISTS",
    message: `${resource} already exists`,
    resource,
    field,
  });
}

/**
 * Throw for validation errors
 */
export function throwValidationError(message: string, field?: string): never {
  throw new ConvexError<AppError>({
    code: "VALIDATION_ERROR",
    message,
    field,
  });
}

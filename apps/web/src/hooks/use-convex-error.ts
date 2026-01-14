"use client";

import { useState, useCallback, useRef } from "react";
import { ErrorCode, getErrorData, getErrorMessage } from "@/lib/convex-errors";

/** Error state for displaying in ErrorAlert */
export interface ErrorState {
  code: ErrorCode;
  message: string;
  title?: string;
}

/** Default auto-dismiss timeout in milliseconds */
const AUTO_DISMISS_TIMEOUT = 5000;

/**
 * Hook for handling Convex errors with automatic toast/alert logic
 *
 * Usage:
 * ```tsx
 * const { error, showError, clearError, handleError } = useConvexError();
 *
 * const handleSubmit = async () => {
 *   try {
 *     await someMutation({ ... });
 *   } catch (error) {
 *     showError(
 *       error instanceof Error ? error.message : "Erro desconhecido",
 *       "Erro ao criar"
 *     );
 *   }
 * };
 *
 * // In render:
 * {error && (
 *   <ErrorAlert
 *     code={error.code}
 *     message={error.message}
 *     onDismiss={clearError}
 *   />
 * )}
 * ```
 */
export function useConvexError(autoDismissMs: number = AUTO_DISMISS_TIMEOUT) {
  const [error, setError] = useState<ErrorState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /** Clear any existing timeout */
  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      globalThis.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /** Clear the error */
  const clearError = useCallback(() => {
    clearTimeout();
    setError(null);
  }, [clearTimeout]);

  /**
   * Show error with auto-dismiss
   * @param message - Error message to display
   * @param title - Optional custom title
   * @param code - Error code (defaults to VALIDATION_ERROR)
   */
  const showError = useCallback(
    (message: string, title?: string, code: ErrorCode = "VALIDATION_ERROR") => {
      clearTimeout();
      setError({ code, message, title });

      // Auto-dismiss after timeout
      timeoutRef.current = globalThis.setTimeout(() => {
        setError(null);
      }, autoDismissMs);
    },
    [autoDismissMs, clearTimeout],
  );

  /**
   * Handle Convex error - extracts message from ConvexError
   */
  const handleError = useCallback(
    (err: unknown, customTitle?: string) => {
      const data = getErrorData(err);

      if (data) {
        showError(data.message, customTitle, data.code);
      } else {
        const message = getErrorMessage(err);
        showError(message, customTitle);
      }
    },
    [showError],
  );

  /**
   * Handle error with custom messages per error code
   */
  const handleErrorWithMessages = useCallback(
    (err: unknown, customMessages?: Partial<Record<ErrorCode, string>>, customTitle?: string) => {
      const data = getErrorData(err);

      if (data) {
        const customMessage = customMessages?.[data.code];
        const message = customMessage || data.message;
        showError(message, customTitle, data.code);
      } else {
        const message = getErrorMessage(err);
        showError(message, customTitle);
      }
    },
    [showError],
  );

  // Legacy support - keeping criticalError for backwards compatibility
  const criticalError = error
    ? { code: error.code, message: error.message, resource: undefined, field: undefined }
    : null;

  return {
    /** Current error state */
    error,
    /** Show error with message, title and auto-dismiss */
    showError,
    /** Clear the error immediately */
    clearError,
    /** Handle Convex error - extracts message from ConvexError */
    handleError,
    /** Handle error with custom messages per error code */
    handleErrorWithMessages,
    /** @deprecated Use error instead */
    criticalError,
    /** @deprecated Use clearError instead */
    clearCriticalError: clearError,
  };
}

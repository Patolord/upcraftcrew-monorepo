"use client";

import { AlertCircle, ShieldAlert, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ErrorCode } from "@/lib/convex-errors";

interface ErrorAlertProps {
  code: ErrorCode;
  message: string;
  title?: string;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Error alert component for displaying errors with auto-dismiss support
 * Uses shadcn Alert with destructive variant
 */
export function ErrorAlert({ code, message, title, onDismiss, className }: ErrorAlertProps) {
  const isAuthError = code === "UNAUTHENTICATED" || code === "UNAUTHORIZED" || code === "FORBIDDEN";

  const getDefaultTitle = () => {
    switch (code) {
      case "UNAUTHENTICATED":
        return "Autenticação Necessária";
      case "UNAUTHORIZED":
        return "Acesso Negado";
      case "FORBIDDEN":
        return "Ação Proibida";
      case "NOT_FOUND":
        return "Não Encontrado";
      case "ALREADY_EXISTS":
        return "Já Existe";
      case "VALIDATION_ERROR":
        return "Erro de Validação";
      default:
        return "Erro";
    }
  };

  return (
    <Alert variant="destructive" className={className}>
      {isAuthError ? <ShieldAlert className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      <AlertTitle className="flex items-center justify-between">
        {title || getDefaultTitle()}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-destructive/20"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>
        )}
      </AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

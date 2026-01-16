"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XIcon, CheckIcon } from "lucide-react";
import React from "react";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  currentStep?: number;
  steps?: { id: string; label: string }[];
  onStepChange?: (step: number) => void;
}

export function BudgetModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  currentStep = 0,
  steps = [],
  onStepChange,
}: BudgetModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity pointer-events-none"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-6xl bg-admin-background rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-in fade-in zoom-in-95 overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-8 pt-6 pb-4 bg-admin-background">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-base-200"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-base-content">{title}</h2>
              {subtitle && <p className="text-sm text-base-content/60 mt-1">{subtitle}</p>}
            </div>

            {/* Stepper */}
            {steps.length > 0 && (
              <div className="relative flex items-center justify-center -mx-8 px-8">
                <div className="flex items-center bg-orange-500 rounded-full px-6 py-3 gap-6">
                  {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                      <Button
                        key={step.id}
                        type="button"
                        onClick={() => onStepChange?.(index)}
                        className="flex items-center gap-2 group bg-orange-500"
                      >
                        {/* Step Circle */}
                        <div
                          className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                            transition-all duration-200
                            ${
                              isActive
                                ? "bg-white text-orange-500 ring-2 ring-white ring-offset-2 ring-offset-orange-500"
                                : isCompleted
                                  ? "bg-white text-orange-500"
                                  : "bg-orange-400 text-white"
                            }
                          `}
                        >
                          {isCompleted ? <CheckIcon className="w-3 h-3" /> : index + 1}
                        </div>

                        {/* Step Label */}
                        <span
                          className={`
                            text-xs font-medium hidden sm:block
                            ${isActive ? "text-white" : "text-orange-100"}
                          `}
                        >
                          {step.label}
                        </span>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                          <div className="w-8 h-0.5 bg-orange-400 ml-2" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-8 pb-6 max-h-[60vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  );
}

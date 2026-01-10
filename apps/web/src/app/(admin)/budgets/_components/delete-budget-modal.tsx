"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface DeleteBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  budgetTitle: string;
  isDeleting?: boolean;
}

export function DeleteBudgetModal({
  isOpen,
  onClose,
  onConfirm,
  budgetTitle,
  isDeleting = false,
}: DeleteBudgetModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal modal-open"
      role="dialog"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      aria-modal="true"
    >
      <div className="modal-box">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="bg-error/10 rounded-full p-4 mb-4" aria-hidden="true">
            <span className="iconify lucide--trash-2 size-12 text-error" />
          </div>

          {/* Title */}
          <h3 id="delete-modal-title" className="font-bold text-xl mb-2">
            Delete Budget?
          </h3>

          {/* Description */}
          <div id="delete-modal-description">
            <p className="text-base-content/70 mb-2">Are you sure you want to delete the budget:</p>
            <p className="font-semibold text-lg mb-4">"{budgetTitle}"</p>
          </div>

          {/* Warning */}
          <div className="alert alert-warning mb-6" role="alert">
            <span className="iconify lucide--alert-triangle size-5" aria-hidden="true" />
            <span className="text-sm">This action cannot be undone!</span>
          </div>

          {/* Actions */}
          <div className="flex text-white gap-3 w-full">
            <Button
              type="button"
              className="btn btn-ghost flex-1"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="btn btn-ghost flex-1"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        disabled={isDeleting}
        aria-label="Close modal"
        tabIndex={-1}
      />
    </div>
  );
}

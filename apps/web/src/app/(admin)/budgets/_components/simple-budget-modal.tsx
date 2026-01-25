"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SaveIcon, Loader2Icon, XIcon } from "lucide-react";
import { useConvexError } from "@/hooks/use-convex-error";
import { ErrorAlert } from "@/components/ui/error-alert";
import React from "react";

interface SimpleBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const statusOptions = [
  { value: "draft", label: "Rascunho" },
  { value: "sent", label: "Enviado" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Rejeitado" },
  { value: "cancelled", label: "Cancelado" },
];

export function SimpleBudgetModal({ isOpen, onClose, onSuccess }: SimpleBudgetModalProps) {
  const createSimpleBudget = useMutation(api.budgets.createSimpleBudget);
  const { error, clearError, handleError } = useConvexError();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    totalAmount: 0,
    status: "draft" as "draft" | "sent" | "approved" | "rejected" | "cancelled" | "expired",
    validUntil: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days from now
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        client: "",
        totalAmount: 0,
        status: "draft",
        validUntil: Date.now() + 15 * 24 * 60 * 60 * 1000,
      });
      clearError();
    }
  }, [isOpen, clearError]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createSimpleBudget({
        title: formData.title,
        client: formData.client,
        totalAmount: formData.totalAmount,
        status: formData.status,
        validUntil: formData.validUntil,
      });
      toast.success("Orçamento criado com sucesso!");
      onSuccess?.();
      onClose();
    } catch (err) {
      handleError(err, "Erro ao criar orçamento");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          className="relative w-full max-w-lg bg-admin-background rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-in fade-in zoom-in-95 overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 bg-admin-background border-b border-border">
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
            <div>
              <h2 className="text-xl font-semibold text-base-content">Novo Orçamento</h2>
              <p className="text-sm text-base-content/60 mt-1">
                Cadastre um orçamento simples para acompanhamento
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {error && (
              <div className="mb-4">
                <ErrorAlert
                  code={error.code}
                  message={error.message}
                  title={error.title}
                  onDismiss={clearError}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                  Nome do Orçamento
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Website Institucional"
                  required
                  className="border border-base-300 rounded-lg focus:border-orange-500"
                />
              </div>

              <div>
                <Label htmlFor="client" className="text-sm font-medium mb-2 block">
                  Cliente
                </Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value }))}
                  placeholder="Nome do cliente"
                  required
                  className="border border-base-300 rounded-lg focus:border-orange-500"
                />
              </div>

              <div>
                <Label htmlFor="totalAmount" className="text-sm font-medium mb-2 block">
                  Valor (R$)
                </Label>
                <Input
                  id="totalAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalAmount || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      totalAmount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0,00"
                  required
                  className="border border-base-300 rounded-lg focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                    Status
                  </Label>
                  <select
                    id="status"
                    className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as typeof formData.status,
                      }))
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="validUntil" className="text-sm font-medium mb-2 block">
                    Válido até
                  </Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={new Date(formData.validUntil).toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        validUntil: new Date(e.target.value).getTime(),
                      }))
                    }
                    className="border border-base-300 rounded-lg focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-200">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSubmitting ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <SaveIcon className="h-4 w-4" />
                  )}
                  Criar Orçamento
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

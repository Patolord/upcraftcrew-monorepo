"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { ClientSelect } from "@/components/client-select";
import { toast } from "sonner";
import { Loader2Icon, XIcon, PlusCircleIcon } from "lucide-react";
import { useConvexError } from "@/hooks/use-convex-error";
import { ErrorAlert } from "@/components/ui/error-alert";
import type { TransactionType, TransactionCategory } from "@/types/finance";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import React from "react";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentStatus = "pending" | "completed" | "failed";

const initialFormData = {
  description: "",
  amount: "",
  type: "income" as TransactionType,
  category: "project-payment" as TransactionCategory,
  status: "completed" as PaymentStatus,
  date: new Date().toISOString().split("T")[0],
  clientIdRef: undefined as Id<"clients"> | undefined,
  projectId: "",
  imageUrl: undefined as string | undefined,
};

export function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTransaction = useMutation(api.finance.createTransaction);
  const projects = useQuery(api.projects.getProjects);
  const { error, clearError, handleError } = useConvexError();

  const [formData, setFormData] = useState(initialFormData);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialFormData,
        date: new Date().toISOString().split("T")[0],
      });
      clearError();
    }
  }, [isOpen, clearError]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, isSubmitting]);

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

    if (!formData.description || !formData.amount) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("O valor deve ser um número positivo");
      return;
    }

    setIsSubmitting(true);

    try {
      await createTransaction({
        description: formData.description,
        amount: amount,
        type: formData.type,
        category: formData.category,
        status: formData.status,
        date: new Date(formData.date).getTime(),
        clientIdRef: formData.clientIdRef,
        projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
        imageUrl: formData.imageUrl,
      });

      toast.success("Transação criada com sucesso!");
      onClose();
    } catch (err) {
      handleError(err, "Erro ao criar transação");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Category options based on transaction type
  const categoryOptions: Record<TransactionType, { value: TransactionCategory; label: string }[]> =
    {
      income: [
        { value: "project-payment", label: "Pagamento de Projeto" },
        { value: "salary", label: "Salário" },
        { value: "consultant", label: "Consultoria" },
        { value: "other", label: "Outro" },
      ],
      expense: [
        { value: "subscription", label: "Assinatura" },
        { value: "equipment", label: "Equipamento" },
        { value: "marketing", label: "Marketing" },
        { value: "office", label: "Escritório" },
        { value: "software", label: "Software" },
        { value: "consultant", label: "Consultoria" },
        { value: "other", label: "Outro" },
      ],
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
        onClick={handleClose}
      >
        <div
          className="relative w-full max-w-2xl bg-admin-background rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-in fade-in zoom-in-95 overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 bg-admin-background border-b border-border">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-base-200"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>

            {/* Title */}
            <div>
              <h2 className="text-xl font-semibold text-base-content">Nova Transação</h2>
              <p className="text-sm text-base-content/60 mt-1">
                Preencha os detalhes abaixo para criar uma nova transação
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
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
              {/* Type */}
              <div>
                <Label htmlFor="type" className="text-sm font-medium mb-2 block">
                  Tipo *
                </Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => {
                    const newType = e.target.value as TransactionType;
                    setFormData({
                      ...formData,
                      type: newType,
                      category: newType === "income" ? "project-payment" : "subscription",
                    });
                  }}
                  className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                  Descrição *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Digite a descrição da transação"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                  className="border border-base-300 rounded-lg focus:border-orange-500"
                />
              </div>

              {/* Amount and Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
                    Valor (R$) *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="border border-base-300 rounded-lg focus:border-orange-500"
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="text-sm font-medium mb-2 block">
                    Data *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="border border-base-300 rounded-lg focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                    Categoria *
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as TransactionCategory })
                    }
                    className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categoryOptions[formData.type].map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                    Status *
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as PaymentStatus })
                    }
                    className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pending">Pendente</option>
                    <option value="completed">Concluído</option>
                    <option value="failed">Falhou</option>
                  </select>
                </div>
              </div>

              {/* Project and Client */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectId" className="text-sm font-medium mb-2 block">
                    Projeto (Opcional)
                  </Label>
                  <select
                    id="projectId"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Nenhum projeto</option>
                    {projects?.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Cliente (Opcional)</Label>
                  <ClientSelect
                    value={formData.clientIdRef}
                    onValueChange={(id) => setFormData({ ...formData, clientIdRef: id })}
                    placeholder="Selecione um cliente"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Comprovante/Recibo (Opcional)
                </Label>
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  folder="finance/transactions"
                  disabled={isSubmitting}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
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
                    <PlusCircleIcon className="h-4 w-4" />
                  )}
                  Criar Transação
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

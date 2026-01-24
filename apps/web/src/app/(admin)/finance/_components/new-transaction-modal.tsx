"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { TransactionType, TransactionCategory } from "@/types/finance";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import React from "react";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentStatus = "pending" | "completed" | "failed";

export function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTransaction = useMutation(api.finance.createTransaction);
  const projects = useQuery(api.projects.getProjects);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "income" as TransactionType,
    category: "project-payment" as TransactionCategory,
    status: "completed" as PaymentStatus,
    date: new Date().toISOString().split("T")[0],
    clientId: "",
    projectId: "",
  });

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
        clientId: formData.clientId || undefined,
        projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
      });

      toast.success("Transação criada com sucesso!");

      // Reset form
      setFormData({
        description: "",
        amount: "",
        type: "income",
        category: "project-payment",
        status: "completed",
        date: new Date().toISOString().split("T")[0],
        clientId: "",
        projectId: "",
      });

      onClose();
    } catch (error) {
      console.error("Falha ao criar transação:", error);
      toast.error("Falha ao criar transação. Por favor, tente novamente.");
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para criar uma nova transação. Campos obrigatórios são
            marcados com *.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => {
                const newType = e.target.value as TransactionType;
                setFormData({
                  ...formData,
                  type: newType,
                  // Reset category when type changes
                  category: newType === "income" ? "project-payment" : "subscription",
                });
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Digite a descrição da transação"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as TransactionCategory })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {categoryOptions[formData.type].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as PaymentStatus })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="pending">Pendente</option>
                <option value="completed">Concluído</option>
                <option value="failed">Falhou</option>
              </select>
            </div>
          </div>

          {/* Project and Client */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">Projeto (Opcional)</Label>
              <select
                id="projectId"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Nenhum projeto</option>
                {projects?.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente (Opcional)</Label>
              <Input
                id="clientId"
                placeholder="Nome do cliente"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Transação"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

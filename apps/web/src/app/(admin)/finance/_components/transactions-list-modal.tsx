"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Loader2Icon,
  XIcon,
  PencilIcon,
  Trash2Icon,
  SearchIcon,
  WalletIcon,
  ArrowLeftIcon,
  SaveIcon,
} from "lucide-react";
import { useConvexError } from "@/hooks/use-convex-error";
import { ErrorAlert } from "@/components/ui/error-alert";
import type { TransactionType, TransactionCategory } from "@/types/finance";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import React from "react";

interface Transaction {
  _id: Id<"transactions">;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  status: "pending" | "completed" | "failed";
  date: number;
  clientId?: string;
  projectId?: Id<"projects">;
  imageUrl?: string;
}

interface TransactionsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

type PaymentStatus = "pending" | "completed" | "failed";

function formatTransactionDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    "project-payment": "💼",
    salary: "💰",
    subscription: "📱",
    equipment: "🔧",
    marketing: "📢",
    office: "🏢",
    software: "💻",
    consultant: "👨‍💼",
    other: "📦",
  };
  return icons[category] || "📦";
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "project-payment": "Projeto",
    salary: "Salário",
    subscription: "Assinatura",
    equipment: "Equipamento",
    marketing: "Marketing",
    office: "Escritório",
    software: "Software",
    consultant: "Consultoria",
    other: "Outro",
  };
  return labels[category] || category;
}

export function TransactionsListModal({
  isOpen,
  onClose,
  transactions,
}: TransactionsListModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateTransactionMutation = useMutation(api.finance.updateTransaction);
  const deleteTransactionMutation = useMutation(api.finance.deleteTransaction);
  const projects = useQuery(api.projects.getProjects);
  const { error, clearError, handleError } = useConvexError();

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "income" as TransactionType,
    category: "project-payment" as TransactionCategory,
    status: "completed" as PaymentStatus,
    date: "",
    clientId: "",
    projectId: "",
  });

  // Filter transactions based on search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const query = searchQuery.toLowerCase();
    return transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(query) || t.category.toLowerCase().includes(query),
    );
  }, [transactions, searchQuery]);

  // Sort by date descending
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => b.date - a.date);
  }, [filteredTransactions]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        if (editingTransaction) {
          setEditingTransaction(null);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, isSubmitting, editingTransaction]);

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

  // Populate form when editing
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description: editingTransaction.description,
        amount: editingTransaction.amount.toString(),
        type: editingTransaction.type,
        category: editingTransaction.category as TransactionCategory,
        status: editingTransaction.status,
        date: new Date(editingTransaction.date).toISOString().split("T")[0],
        clientId: editingTransaction.clientId || "",
        projectId: editingTransaction.projectId || "",
      });
      clearError();
    }
  }, [editingTransaction, clearError]);

  const handleClose = () => {
    if (!isSubmitting) {
      setEditingTransaction(null);
      setSearchQuery("");
      onClose();
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingTransaction) return;

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
      await updateTransactionMutation({
        id: editingTransaction._id,
        description: formData.description,
        amount: amount,
        type: formData.type,
        category: formData.category,
        status: formData.status,
        date: new Date(formData.date).getTime(),
        clientId: formData.clientId || undefined,
        projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
      });

      toast.success("Transação atualizada com sucesso!");
      setEditingTransaction(null);
    } catch (err) {
      handleError(err, "Erro ao atualizar transação");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTransaction) return;

    setIsSubmitting(true);

    try {
      await deleteTransactionMutation({ id: deleteTransaction._id });
      toast.success("Transação excluída com sucesso!");
      setDeleteTransaction(null);
    } catch (err) {
      handleError(err, "Erro ao excluir transação");
    } finally {
      setIsSubmitting(false);
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
          className="relative w-full max-w-3xl bg-admin-background rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-in fade-in zoom-in-95 overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 bg-admin-background border-b border-border shrink-0">
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
            <div className="flex items-center gap-3">
              {editingTransaction && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingTransaction(null)}
                  disabled={isSubmitting}
                  className="h-8 w-8 rounded-full"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h2 className="text-xl font-semibold text-base-content">
                  {editingTransaction ? "Editar Transação" : "Todas as Transações"}
                </h2>
                <p className="text-sm text-base-content/60 mt-1">
                  {editingTransaction
                    ? "Edite os detalhes da transação"
                    : `${sortedTransactions.length} transações encontradas`}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto flex-1">
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

            {editingTransaction ? (
              /* Edit Form */
              <form onSubmit={handleEditSubmit} className="space-y-4">
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
                        setFormData({
                          ...formData,
                          category: e.target.value as TransactionCategory,
                        })
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
                    <Label htmlFor="clientId" className="text-sm font-medium mb-2 block">
                      Cliente (Opcional)
                    </Label>
                    <Input
                      id="clientId"
                      placeholder="Nome do cliente"
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="border border-base-300 rounded-lg focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingTransaction(null)}
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
                      <SaveIcon className="h-4 w-4" />
                    )}
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            ) : (
              /* Transaction List */
              <>
                {/* Search */}
                <div className="relative mb-4">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar transações..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border border-base-300 rounded-lg"
                  />
                </div>

                {/* Transaction List */}
                {sortedTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <WalletIcon className="size-10 mb-3 opacity-50" />
                    <p className="text-sm">
                      {searchQuery ? "Nenhuma transação encontrada" : "Nenhuma transação"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedTransactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-11 w-11 shrink-0">
                            <AvatarFallback className="bg-violet-100 text-violet-600 font-medium text-lg">
                              {getCategoryIcon(transaction.category)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 line-clamp-1">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium px-2 py-0.5",
                                  transaction.type === "income"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    : "bg-rose-50 text-rose-600 border-rose-200",
                                )}
                              >
                                {getCategoryLabel(transaction.category)}
                              </Badge>
                              <span className="text-gray-400">•</span>
                              <span>{formatTransactionDate(transaction.date)}</span>
                              {transaction.status === "pending" && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-yellow-50 text-yellow-600 border-yellow-200"
                                  >
                                    Pendente
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span
                            className={cn(
                              "font-semibold text-base whitespace-nowrap",
                              transaction.type === "income" ? "text-emerald-500" : "text-rose-500",
                            )}
                          >
                            {transaction.type === "income" ? "+" : "-"}R${" "}
                            {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingTransaction(transaction)}
                              className="h-8 w-8 text-gray-500 hover:text-orange-500"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteTransaction(transaction)}
                              className="h-8 w-8 text-gray-500 hover:text-rose-500"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTransaction} onOpenChange={() => setDeleteTransaction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Transação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a transação &quot;{deleteTransaction?.description}
              &quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-rose-500 hover:bg-rose-600"
            >
              {isSubmitting ? (
                <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2Icon className="h-4 w-4 mr-2" />
              )}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

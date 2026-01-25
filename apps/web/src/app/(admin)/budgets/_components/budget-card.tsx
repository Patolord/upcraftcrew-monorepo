"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import {
  EyeIcon,
  CalendarIcon,
  ChevronDownIcon,
  Trash2Icon,
  PencilIcon,
  FolderPlusIcon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";
import React from "react";

const statusConfig = {
  draft: {
    label: "Rascunho",
    variant: "secondary" as const,
  },
  sent: {
    label: "Enviado",
    variant: "default" as const,
  },
  approved: {
    label: "Aprovado",
    variant: "success" as const,
  },
  rejected: {
    label: "Rejeitado",
    variant: "destructive" as const,
  },
  cancelled: {
    label: "Cancelado",
    variant: "secondary" as const,
  },
  expired: {
    label: "Expirado",
    variant: "outline" as const,
  },
};

const statusOptions = [
  { value: "draft", label: "Rascunho" },
  { value: "sent", label: "Enviado" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Rejeitado" },
  { value: "cancelled", label: "Cancelado" },
] as const;

interface Budget {
  _id: Id<"budgets">;
  type?: "budget" | "proposal";
  title: string;
  client: string;
  description: string;
  status: "draft" | "sent" | "approved" | "rejected" | "cancelled" | "expired";
  totalAmount: number;
  currency: string;
  validUntil: number;
  createdAt: number;
}

function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

function formatDate(timestamp: number | undefined): string {
  if (!timestamp || isNaN(timestamp)) return "—";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
}

export function BudgetCard({ budget }: { budget: Budget }) {
  const router = useRouter();
  const updateBudgetStatus = useMutation(api.budgets.updateBudgetStatus);
  const deleteBudget = useMutation(api.budgets.deleteBudget);
  const createProjectFromBudget = useMutation(api.projects.createProjectFromBudget);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const status = statusConfig[budget.status];
  const isExpired = budget.validUntil < Date.now() && budget.status === "sent";
  const isProposal = budget.type === "proposal" || budget.type === undefined; // Legacy budgets are treated as proposals
  const isApproved = budget.status === "approved";

  const handleStatusChange = async (
    newStatus: "draft" | "sent" | "approved" | "rejected" | "cancelled" | "expired",
  ) => {
    try {
      await updateBudgetStatus({
        id: budget._id,
        status: newStatus,
      });
      toast.success(`Status atualizado para ${statusConfig[newStatus].label}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBudget({ id: budget._id });
      toast.success("Orçamento excluído com sucesso!");
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete budget:", error);
      toast.error("Erro ao excluir orçamento");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConvertToProject = async () => {
    setIsConverting(true);
    try {
      const projectId = await createProjectFromBudget({ budgetId: budget._id });
      toast.success("Projeto criado com sucesso!");
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error("Failed to convert to project:", error);
      toast.error("Erro ao criar projeto");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Card className="border border-border rounded-md hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="outline"
                className={
                  isProposal
                    ? "text-xs border-orange-300 text-orange-600 bg-orange-50"
                    : "text-xs border-blue-300 text-blue-600 bg-blue-50"
                }
              >
                {isProposal ? "Proposta" : "Orçamento"}
              </Badge>
            </div>
            <CardTitle className="text-lg">{budget.title}</CardTitle>
            <CardDescription className="mt-1">{budget.client}</CardDescription>
          </div>
          <CardAction>
            {/* Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                  <Badge
                    variant={isExpired ? "outline" : status.variant}
                    className="cursor-pointer flex items-center gap-1"
                  >
                    {isExpired ? "Expirado" : status.label}
                    <ChevronDownIcon className="h-3 w-3" />
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={budget.status === option.value ? "bg-muted" : ""}
                  >
                    <Badge variant={statusConfig[option.value].variant} className="mr-2">
                      {option.label}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Description - only show for proposals with description */}
        {budget.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{budget.description}</p>
        )}

        {/* Value */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Valor Total</p>
          <p className="text-2xl font-bold text-orange-500">
            {formatCurrency(budget.totalAmount, budget.currency)}
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Criado em</p>
            <p className="text-sm font-medium flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {formatDate(budget.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Válido até</p>
            <p
              className={`text-sm font-medium flex items-center gap-1 ${isExpired ? "text-destructive" : ""}`}
            >
              <CalendarIcon className="h-3 w-3" />
              {formatDate(budget.validUntil)}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Actions - Always at bottom */}
      <CardFooter className="justify-end mt-auto gap-2">
        {/* Delete Button */}
        <Tooltip>
          <TooltipTrigger
            render={(props) => (
              <Button
                {...props}
                variant="outline"
                size="icon"
                className="h-8 w-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            )}
          />
          <TooltipContent>
            <p>Excluir</p>
          </TooltipContent>
        </Tooltip>

        {/* Edit Button */}
        <Tooltip>
          <TooltipTrigger
            render={(props) => (
              <Button
                {...props}
                variant="outline"
                size="icon"
                className="h-8 w-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg"
                onClick={() => router.push(`/budgets/${budget._id}`)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            )}
          />
          <TooltipContent>
            <p>Editar</p>
          </TooltipContent>
        </Tooltip>

        {/* Convert to Project Button - Only for approved budgets */}
        {isApproved && (
          <Tooltip>
            <TooltipTrigger
              render={(props) => (
                <Button
                  {...props}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={handleConvertToProject}
                  disabled={isConverting}
                >
                  {isConverting ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <FolderPlusIcon className="h-4 w-4" />
                  )}
                </Button>
              )}
            />
            <TooltipContent>
              <p>Criar Projeto</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* View Button */}
        <Tooltip>
          <TooltipTrigger
            render={(props) => (
              <Button
                {...props}
                className="bg-orange-500 text-white rounded-md text-xs h-8"
                onClick={() => router.push(`/budgets/${budget._id}`)}
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
            )}
          />
          <TooltipContent>
            <p>Ver detalhes</p>
          </TooltipContent>
        </Tooltip>
      </CardFooter>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o orçamento &quot;
              {budget.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="bg-white rounded-lg">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="">
              {isDeleting ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

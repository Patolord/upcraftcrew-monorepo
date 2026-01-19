"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { BudgetFormModal } from "../_components/budget-new/budget-form-modal";
import {
  ArrowLeftIcon,
  InfoIcon,
  Trash2Icon,
  Loader2Icon,
  PencilIcon,
  FileTextIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useEnsureCurrentUser } from "@/hooks/use-ensure-current-user";
import React from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  expired: {
    label: "Expirado",
    variant: "outline" as const,
  },
};

function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export default function BudgetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const budgetId = params.id as string;

  useEnsureCurrentUser();

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const deleteBudget = useMutation(api.budgets.deleteBudget);

  // Validate that we have a valid budget ID
  const isValidId = budgetId && budgetId !== "all" && !budgetId.includes("/");

  // Fetch budget data - only if we have a valid ID
  const budget = useQuery(
    api.budgets.getBudgetById,
    isValidId ? { id: budgetId as Id<"budgets"> } : "skip",
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (!budgetId) return;
      await deleteBudget({ id: budgetId as Id<"budgets"> });
      toast.success("Orçamento excluído com sucesso!");
      router.push("/budgets");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir orçamento");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleGeneratePDF = () => {
    window.open(`/budgets/${budgetId}/pdf`, "_blank");
  };

  // Handle invalid ID
  if (!isValidId) {
    return (
      <div className="p-6 pl-12 pr-12 space-y-6">
        <Card className="p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <InfoIcon className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">ID de Orçamento Inválido</h3>
          <p className="text-muted-foreground mb-4">
            O ID do orçamento fornecido não é válido. Verifique a URL e tente novamente.
          </p>
          <Button
            onClick={() => router.push("/budgets")}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar para Orçamentos
          </Button>
        </Card>
      </div>
    );
  }

  // Handle loading state
  if (budget === undefined) {
    return (
      <div className="p-6 pl-12 pr-12 flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader2Icon className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando detalhes do orçamento...</p>
        </div>
      </div>
    );
  }

  // Handle not found state
  if (budget === null) {
    return (
      <div className="p-6 pl-12 pr-12 space-y-6">
        <Card className="p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <InfoIcon className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Orçamento Não Encontrado</h3>
          <p className="text-muted-foreground mb-4">
            O orçamento que você está procurando não existe ou foi excluído.
          </p>
          <Button
            onClick={() => router.push("/budgets")}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar para Orçamentos
          </Button>
        </Card>
      </div>
    );
  }

  const status = statusConfig[budget.status];
  const isExpired = budget.validUntil < Date.now() && budget.status === "sent";

  return (
    <div className="p-6 pl-12 pr-12 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/budgets")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Budget Detail Header */}
      <header className="flex items-center justify-between py-6">
        {/* Title */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-medium text-shadow-sm text-foreground">{budget.title}</h1>
            <Badge variant={isExpired ? "outline" : status.variant}>
              {isExpired ? "Expirado" : status.label}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{budget.client}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGeneratePDF}
            className="border-blue-200 text-blue-600 rounded-md hover:bg-blue-50 hover:text-blue-700"
          >
            <FileTextIcon className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            className="border-red-200 text-red-600 rounded-md hover:bg-red-50 hover:text-red-700"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditModal(true)}
            className="border-orange-200 text-orange-600 rounded-md hover:bg-orange-50 hover:text-orange-700"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Budget Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <UserIcon className="h-4 w-4" />
              <span className="text-sm">Cliente</span>
            </div>
            <p className="font-semibold">{budget.client}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">Criado em</span>
            </div>
            <p className="font-semibold">
              {new Date(budget.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">Válido até</span>
            </div>
            <p className={`font-semibold ${isExpired ? "text-destructive" : ""}`}>
              {new Date(budget.validUntil).toLocaleDateString("pt-BR")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-4">
            <div className="text-muted-foreground mb-1 text-sm">Valor Total</div>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(budget.totalAmount, budget.currency)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {budget.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{budget.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Objectives */}
      {budget.objectives && budget.objectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Objetivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budget.objectives.map((objective, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{objective.title}</p>
                    <p className="text-sm text-muted-foreground">{objective.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scope Options */}
      {budget.scopeOptions && budget.scopeOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Escopo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budget.scopeOptions.map((scope, index) => (
                <Card
                  key={index}
                  className={`${scope.isSelected ? "border-orange-500 bg-orange-50" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{scope.name}</CardTitle>
                      {scope.isSelected && (
                        <Badge variant="default" className="bg-orange-500">
                          Selecionado
                        </Badge>
                      )}
                    </div>
                    {scope.value && (
                      <p className="text-lg font-bold text-orange-600">
                        {formatCurrency(scope.value, budget.currency)}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {scope.features.map((feature, fIndex) => (
                        <li
                          key={fIndex}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-orange-500">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items Table */}
      {budget.items && budget.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Itens do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-right">Valor Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budget.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unitPrice, budget.currency)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(item.total, budget.currency)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="text-right font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold text-orange-600">
                    {formatCurrency(budget.totalAmount, budget.currency)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Extras */}
      {budget.extras && budget.extras.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Extras</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Recorrência</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budget.extras.map((extra, index) => (
                  <TableRow key={index}>
                    <TableCell>{extra.description}</TableCell>
                    <TableCell>{extra.recurrence || "Único"}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(extra.value, budget.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Payment Terms */}
      {budget.paymentTerms && budget.paymentTerms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Condições de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {budget.paymentTerms.map((term, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-orange-500 font-bold">{index + 1}.</span>
                  {term}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {budget.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{budget.notes}</p>
          </CardContent>
        </Card>
      )}

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
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-orange-500 hover:bg-orange-600 rounded-lg"
            >
              {isDeleting ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir Orçamento"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Budget Modal */}
      {showEditModal && (
        <BudgetFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          initialData={budget}
          onSuccess={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useConvexError } from "@/hooks/use-convex-error";
import { ErrorAlert } from "@/components/ui/error-alert";
import { BudgetFormItems } from "./budget-form-items";
import { BudgetFormObjectives } from "./budget-form-objectives";
import { BudgetFormScope } from "./budget-form-scope";
import { BudgetFormExtras } from "./budget-form-extras";
import { BudgetModal } from "./budget-modal";

interface BudgetItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface BudgetObjective {
  title: string;
  description: string;
}

interface BudgetScopeOption {
  name: string;
  features: string[];
  value?: number;
  isSelected: boolean;
}

interface BudgetExtra {
  description: string;
  value: number;
  recurrence?: string;
}

interface BudgetFormData {
  _id?: Id<"budgets">;
  title: string;
  client: string;
  description: string;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
  currency: string;
  items: BudgetItem[];
  validUntil: number;
  notes?: string;
  objectives?: BudgetObjective[];
  scopeOptions?: BudgetScopeOption[];
  extras?: BudgetExtra[];
  paymentTerms?: string[];
  deliveryDeadline?: string;
}

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BudgetFormData;
  onSuccess?: () => void;
}

const statusOptions = [
  { value: "draft", label: "Rascunho" },
  { value: "sent", label: "Enviado" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Rejeitado" },
  { value: "expired", label: "Expirado" },
];

const steps = [
  { id: "basic", label: "Informações" },
  { id: "objectives", label: "Objetivos" },
  { id: "scope", label: "Escopo" },
  { id: "items", label: "Investimento" },
  { id: "extras", label: "Extras" },
  { id: "payment", label: "Pagamento" },
];

export function BudgetFormModal({ isOpen, onClose, initialData, onSuccess }: BudgetFormModalProps) {
  const createBudget = useMutation(api.budgets.createBudget);
  const updateBudget = useMutation(api.budgets.updateBudget);
  const { error, clearError, handleError } = useConvexError();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Form state
  const [formData, setFormData] = useState<BudgetFormData>({
    title: initialData?.title || "",
    client: initialData?.client || "",
    description: initialData?.description || "",
    status: initialData?.status || "draft",
    currency: initialData?.currency || "BRL",
    items: initialData?.items || [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
    validUntil: initialData?.validUntil || Date.now() + 15 * 24 * 60 * 60 * 1000,
    notes: initialData?.notes || "",
    objectives: initialData?.objectives || [{ title: "", description: "" }],
    scopeOptions: initialData?.scopeOptions || [
      { name: "", features: [""], value: undefined, isSelected: false },
    ],
    extras: initialData?.extras || [],
    paymentTerms: initialData?.paymentTerms || [
      "50% na assinatura da proposta",
      "50% na entrega do projeto",
    ],
    deliveryDeadline: initialData?.deliveryDeadline || "",
    ...initialData,
  });

  const updateField = <K extends keyof BudgetFormData>(field: K, value: BudgetFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (initialData?._id) {
        await updateBudget({
          id: initialData._id,
          title: formData.title,
          client: formData.client,
          description: formData.description,
          status: formData.status,
          currency: formData.currency,
          items: formData.items,
          validUntil: formData.validUntil,
          notes: formData.notes,
          objectives: formData.objectives,
          scopeOptions: formData.scopeOptions,
          extras: formData.extras,
          paymentTerms: formData.paymentTerms,
          deliveryDeadline: formData.deliveryDeadline,
        });
        toast.success("Orçamento atualizado com sucesso!");
      } else {
        await createBudget({
          title: formData.title,
          client: formData.client,
          description: formData.description,
          status: formData.status,
          currency: formData.currency,
          items: formData.items,
          validUntil: formData.validUntil,
          notes: formData.notes,
          objectives: formData.objectives,
          scopeOptions: formData.scopeOptions,
          extras: formData.extras,
          paymentTerms: formData.paymentTerms,
          deliveryDeadline: formData.deliveryDeadline,
        });
        toast.success("Orçamento criado com sucesso!");
      }
      onSuccess?.();
      onClose();
      setCurrentStep(0);
    } catch (err) {
      handleError(err, "Erro ao salvar orçamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setCurrentStep(0);
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <BudgetModal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData?._id ? "Editar Orçamento" : "Novo Orçamento"}
      subtitle="Preencha as informações do orçamento"
      currentStep={currentStep}
      steps={steps}
      onStepChange={setCurrentStep}
    >
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
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Basic Information */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                  Título da Proposta
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Ex: Desenvolvimento de Website"
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
                  onChange={(e) => updateField("client", e.target.value)}
                  placeholder="Nome do cliente"
                  required
                  className="border border-base-300 rounded-lg focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                Descrição
              </Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] px-3 py-2 text-sm bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 border border-base-300 rounded-lg"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Descreva brevemente o projeto..."
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                  Status
                </Label>
                <select
                  id="status"
                  className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.status}
                  onChange={(e) =>
                    updateField("status", e.target.value as BudgetFormData["status"])
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
                <Label htmlFor="currency" className="text-sm font-medium mb-2 block">
                  Moeda
                </Label>
                <select
                  id="currency"
                  className="w-full h-10 px-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 border border-base-300 rounded-lg"
                  value={formData.currency}
                  onChange={(e) => updateField("currency", e.target.value)}
                >
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
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
                  onChange={(e) => updateField("validUntil", new Date(e.target.value).getTime())}
                  className="border border-base-300 rounded-lg focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Objectives */}
        {currentStep === 1 && (
          <BudgetFormObjectives
            objectives={formData.objectives || []}
            onChange={(objectives) => updateField("objectives", objectives)}
          />
        )}

        {/* Scope */}
        {currentStep === 2 && (
          <BudgetFormScope
            scopeOptions={formData.scopeOptions || []}
            onChange={(scopeOptions) => updateField("scopeOptions", scopeOptions)}
          />
        )}

        {/* Items */}
        {currentStep === 3 && (
          <BudgetFormItems
            items={formData.items}
            onChange={(items) => updateField("items", items)}
          />
        )}

        {/* Extras */}
        {currentStep === 4 && (
          <BudgetFormExtras
            extras={formData.extras || []}
            onChange={(extras) => updateField("extras", extras)}
          />
        )}

        {/* Payment Terms */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Condições de Pagamento</Label>
              <div className="mt-2 space-y-2">
                {(formData.paymentTerms || []).map((term, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={term}
                      onChange={(e) => {
                        const newTerms = [...(formData.paymentTerms || [])];
                        newTerms[index] = e.target.value;
                        updateField("paymentTerms", newTerms);
                      }}
                      placeholder="Ex: 50% na assinatura"
                      className="border border-base-300 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newTerms = (formData.paymentTerms || []).filter(
                          (_, i) => i !== index,
                        );
                        updateField("paymentTerms", newTerms);
                      }}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateField("paymentTerms", [...(formData.paymentTerms || []), ""])
                  }
                  className="border-dashed"
                >
                  + Adicionar condição
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="deliveryDeadline" className="text-sm font-medium mb-2 block">
                Prazo de Entrega
              </Label>
              <Input
                id="deliveryDeadline"
                value={formData.deliveryDeadline || ""}
                onChange={(e) => updateField("deliveryDeadline", e.target.value)}
                placeholder="Ex: Até 15 dias úteis após aprovação"
                className="border border-base-300 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
                Observações
              </Label>
              <textarea
                id="notes"
                className="w-full min-h-[80px] px-3 py-2 text-sm bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 border border-base-300 rounded-lg"
                value={formData.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Observações adicionais..."
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-base-200">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 0 ? handleClose : handlePrevious}
            className="gap-2"
          >
            {currentStep === 0 ? (
              "Cancelar"
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </>
            )}
          </Button>

          {isLastStep ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {initialData?._id ? "Salvar Alterações" : "Criar Orçamento"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </BudgetModal>
  );
}

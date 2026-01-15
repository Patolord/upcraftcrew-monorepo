"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, FileDown, Loader2 } from "lucide-react";
import { useConvexError } from "@/hooks/use-convex-error";
import { ErrorAlert } from "@/components/ui/error-alert";
import { BudgetFormItems } from "./budget-form-items";
import { BudgetFormObjectives } from "./budget-form-objectives";
import { BudgetFormScope } from "./budget-form-scope";
import { BudgetFormExtras } from "./budget-form-extras";

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

interface BudgetFormProps {
  initialData?: BudgetFormData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions = [
  { value: "draft", label: "Rascunho" },
  { value: "sent", label: "Enviado" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Rejeitado" },
  { value: "expired", label: "Expirado" },
];

export function BudgetForm({ initialData, onSuccess, onCancel }: BudgetFormProps) {
  const createBudget = useMutation(api.budgets.createBudget);
  const updateBudget = useMutation(api.budgets.updateBudget);
  const { error, clearError, handleError } = useConvexError();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("basic");

  // Form state
  const [formData, setFormData] = useState<BudgetFormData>({
    title: initialData?.title || "",
    client: initialData?.client || "",
    description: initialData?.description || "",
    status: initialData?.status || "draft",
    currency: initialData?.currency || "BRL",
    items: initialData?.items || [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
    validUntil: initialData?.validUntil || Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days from now
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData?._id) {
        // Update existing budget
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
        // Create new budget
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
    } catch (err) {
      handleError(err, "Erro ao salvar orçamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (initialData?._id) {
      window.open(`/budgets/${initialData._id}/pdf`, "_blank");
    }
  };

  const sections = [
    { id: "basic", label: "Informações Básicas" },
    { id: "objectives", label: "Objetivos" },
    { id: "scope", label: "Escopo" },
    { id: "items", label: "Investimento" },
    { id: "extras", label: "Extras" },
    { id: "payment", label: "Pagamento" },
  ];

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      {/* Error alert */}
      {error && (
        <div className="px-6 pt-4">
          <ErrorAlert
            code={error.code}
            message={error.message}
            title={error.title}
            onDismiss={clearError}
          />
        </div>
      )}
      {/* Section tabs */}
      <div className="px-6 py-3 border-b border-base-300 overflow-x-auto">
        <div className="flex gap-1">
          {sections.map((section) => (
            <Button
              key={section.id}
              type="button"
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? "bg-orange-500 text-white"
                  : "bg-base-200 text-base-content/70 hover:bg-orange-500 hover:text-white"
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Basic Information */}
        {activeSection === "basic" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="pb-3">
                  Título da Proposta
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Ex: Desenvolvimento de Website"
                  required
                  className="border border-orange-500 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="client" className="pb-3">
                  Cliente
                </Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => updateField("client", e.target.value)}
                  placeholder="Nome do cliente"
                  required
                  className="border border-orange-500 rounded-md"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="pb-3">
                Descrição
              </Label>
              <Textarea
                id="description"
                className="w-full min-h-[100px] resize-none border-orange-500 rounded-md focus-visible:border-orange-500"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Descreva brevemente o projeto..."
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status" className="pb-3">
                  Status
                </Label>
                <select
                  id="status"
                  className="w-full h-8 px-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-ring border border-orange-500 rounded-md"
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
                <Label htmlFor="currency" className="pb-3">
                  Moeda
                </Label>
                <select
                  id="currency"
                  className="w-full h-8 px-2 text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-ring border border-orange-500 rounded-md"
                  value={formData.currency}
                  onChange={(e) => updateField("currency", e.target.value)}
                >
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="validUntil" className="pb-3">
                  Válido até
                </Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={new Date(formData.validUntil).toISOString().split("T")[0]}
                  onChange={(e) => updateField("validUntil", new Date(e.target.value).getTime())}
                  className="border border-orange-500 rounded-md"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="pb-3">
                Observações
              </Label>
              <Textarea
                id="notes"
                className="w-full min-h-[80px] resize-none border-orange-500 rounded-md focus-visible:border-orange-500"
                value={formData.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Observações adicionais..."
              />
            </div>
          </div>
        )}

        {/* Objectives */}
        {activeSection === "objectives" && (
          <BudgetFormObjectives
            objectives={formData.objectives || []}
            onChange={(objectives) => updateField("objectives", objectives)}
          />
        )}

        {/* Scope */}
        {activeSection === "scope" && (
          <BudgetFormScope
            scopeOptions={formData.scopeOptions || []}
            onChange={(scopeOptions) => updateField("scopeOptions", scopeOptions)}
          />
        )}

        {/* Items */}
        {activeSection === "items" && (
          <BudgetFormItems
            items={formData.items}
            onChange={(items) => updateField("items", items)}
          />
        )}

        {/* Extras */}
        {activeSection === "extras" && (
          <BudgetFormExtras
            extras={formData.extras || []}
            onChange={(extras) => updateField("extras", extras)}
          />
        )}

        {/* Payment Terms */}
        {activeSection === "payment" && (
          <div className="space-y-4">
            <div>
              <Label>Condições de Pagamento</Label>
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
                >
                  + Adicionar condição
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="deliveryDeadline">Prazo de Entrega</Label>
              <Input
                id="deliveryDeadline"
                value={formData.deliveryDeadline || ""}
                onChange={(e) => updateField("deliveryDeadline", e.target.value)}
                placeholder="Ex: Até 15 dias úteis após aprovação"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-6 py-4 border-t border-base-300 flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <div className="flex items-center gap-2">
          {initialData?._id && (
            <Button type="button" variant="outline" onClick={handleDownloadPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Gerar PDF
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {initialData?._id ? "Salvar Alterações" : "Criar Orçamento"}
          </Button>
        </div>
      </div>
    </form>
  );
}

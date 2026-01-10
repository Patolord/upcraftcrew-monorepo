"use client";

import { useState, useId } from "react";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

interface NewBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetToEdit?: {
    _id: string;
    title: string;
    client: string;
    description: string;
    status: "draft" | "sent" | "approved" | "rejected" | "expired";
    totalAmount: number;
    currency: string;
    validUntil: number;
    items: BudgetItem[];
    projectId?: string;
    notes?: string;
  };
}

interface BudgetItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function NewBudgetModal({ isOpen, onClose, budgetToEdit }: NewBudgetModalProps) {
  const { formatAmount, config, currency, CURRENCIES } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBudget = useMutation(api.budgets.createBudget);
  const updateBudget = useMutation(api.budgets.updateBudget);
  const projects = useQuery(api.projects.getProjects);
  const formId = useId();

  const isEditMode = !!budgetToEdit;

  const [formData, setFormData] = useState({
    title: budgetToEdit?.title || "",
    client: budgetToEdit?.client || "",
    description: budgetToEdit?.description || "",
    status: (budgetToEdit?.status || "draft") as
      | "draft"
      | "sent"
      | "approved"
      | "rejected"
      | "expired",
    validUntil: budgetToEdit
      ? new Date(budgetToEdit.validUntil).toISOString().split("T")[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    projectId: (budgetToEdit?.projectId || "") as string,
    notes: budgetToEdit?.notes || "",
    currency: budgetToEdit?.currency || currency,
  });

  const [items, setItems] = useState<BudgetItem[]>(
    budgetToEdit?.items.length
      ? budgetToEdit.items
      : [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
  );

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof BudgetItem, value: string | number) => {
    const newItems = [...items];

    // For numeric fields, validate and convert
    if (field === "quantity" || field === "unitPrice") {
      const numValue = typeof value === "string" ? Number.parseFloat(value) : value;
      // Keep the original value if invalid, don't silently convert to 0
      if (!Number.isNaN(numValue) && numValue >= 0) {
        newItems[index] = {
          ...newItems[index],
          [field]: numValue,
        };
        // Recalculate total
        newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
      }
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
    }

    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate items
      if (items.length === 0 || items.every((item) => !item.description)) {
        toast.error("Adicione pelo menos um item ao orçamento");
        setIsSubmitting(false);
        return;
      }

      const validItems = items.filter((item) => item.description.trim() !== "");

      if (isEditMode && budgetToEdit) {
        await updateBudget({
          id: budgetToEdit._id as Id<"budgets">,
          title: formData.title,
          client: formData.client,
          description: formData.description,
          status: formData.status,
          currency: formData.currency,
          items: validItems,
          validUntil: new Date(formData.validUntil).getTime(),
          projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
          notes: formData.notes || undefined,
        });

        toast.success("Orçamento atualizado com sucesso!");
      } else {
        await createBudget({
          title: formData.title,
          client: formData.client,
          description: formData.description,
          status: formData.status,
          currency: formData.currency,
          items: validItems,
          validUntil: new Date(formData.validUntil).getTime(),
          projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
          notes: formData.notes || undefined,
        });

        toast.success("Orçamento criado com sucesso!");
      }

      onClose();
    } catch (error) {
      console.error("Failed to save budget:", error);
      toast.error("Falha ao salvar orçamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">
          {isEditMode ? "Editar Orçamento" : "Criar Novo Orçamento"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Client */}
          <div className="grid grid-cols-2 gap-6">
            <div className="form-control">
              <label htmlFor={`${formId}-title`} className="block mb-2">
                <span className="text-sm font-medium">Título *</span>
              </label>
              <input
                id={`${formId}-title`}
                type="text"
                className="input input-bordered w-full border-2"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor={`${formId}-client`} className="block mb-2">
                <span className="text-sm font-medium">Cliente *</span>
              </label>
              <input
                id={`${formId}-client`}
                type="text"
                className="input input-bordered w-full border-2"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-control">
            <label htmlFor={`${formId}-description`} className="block mb-2">
              <span className="text-sm font-medium">Descrição *</span>
            </label>
            <textarea
              id={`${formId}-description`}
              className="textarea textarea-bordered h-20 w-full border-2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Status, Valid Until, Project, Currency */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="form-control">
              <label htmlFor={`${formId}-status`} className="block mb-2">
                <span className="text-sm font-medium">Status</span>
              </label>
              <select
                id={`${formId}-status`}
                className="select select-bordered w-full border-2"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as typeof formData.status })
                }
              >
                <option value="draft">Rascunho</option>
                <option value="sent">Enviado</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
                <option value="expired">Expirado</option>
              </select>
            </div>
            <div className="form-control">
              <label htmlFor={`${formId}-currency`} className="block mb-2">
                <span className="text-sm font-medium">Moeda *</span>
              </label>
              <select
                id={`${formId}-currency`}
                className="select select-bordered w-full border-2"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value as typeof formData.currency })
                }
                required
              >
                {Object.values(CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label htmlFor={`${formId}-valid-until`} className="block mb-2">
                <span className="text-sm font-medium">Válido Até *</span>
              </label>
              <input
                id={`${formId}-valid-until`}
                type="date"
                className="input input-bordered w-full border-2"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor={`${formId}-project`} className="block mb-2">
                <span className="text-sm font-medium">Projeto (opcional)</span>
              </label>
              <select
                id={`${formId}-project`}
                className="select select-bordered w-full border-2"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                <option value="">Nenhum</option>
                {projects?.map((project: Project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items */}
          <div className="form-control">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Itens do Orçamento</span>
              <Button
                type="button"
                className="btn btn-sm btn-ghost gap-2 text-white"
                onClick={handleAddItem}
              >
                <span className="iconify text-white lucide--plus size-4" />
                Adicionar Item
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      className="input input-bordered w-full border-2"
                      placeholder="Descrição do item"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="input input-bordered w-24 border-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Qtd"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    className="input input-bordered w-28 border-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Preço"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                  />
                  <span className="text-sm font-semibold w-28 text-right">
                    {formatAmount(item.total)}
                  </span>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      className="btn text-white btn-sm btn-ghost btn-circle text-error"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <span className="iconify text-white lucide--trash-2 size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="text-right">
              <div className="text-sm font-medium mb-1">Valor Total do Orçamento:</div>
              <div className="text-3xl font-bold">
                {(() => {
                  const currencyData = CURRENCIES[formData.currency as keyof typeof CURRENCIES];
                  if (!currencyData) {
                    return `${formData.currency} ${totalAmount.toFixed(2)}`;
                  }
                  return new Intl.NumberFormat(currencyData.locale, {
                    style: "currency",
                    currency: formData.currency,
                  }).format(totalAmount);
                })()}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-control">
            <label htmlFor={`${formId}-notes`} className="block mb-2">
              <span className="text-sm font-medium">Observações (opcional)</span>
            </label>
            <textarea
              id={`${formId}-notes`}
              className="textarea textarea-bordered h-16 w-full border-2"
              placeholder="Termos, condições ou observações adicionais..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="modal-action">
            <Button
              type="button"
              className="btn btn-ghost text-white"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="btn text-white btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  {isEditMode ? "Salvando..." : "Criando..."}
                </>
              ) : isEditMode ? (
                "Salvar Alterações"
              ) : (
                "Criar Orçamento"
              )}
            </Button>
          </div>
        </form>
      </div>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";

interface BudgetItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Budget {
  _id: string;
  title: string;
  client: string;
  description: string;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
  totalAmount: number;
  currency: string;
  validUntil: number;
  createdAt: number;
  items: BudgetItem[];
  notes?: string;
  projectId?: string;
}

interface ViewBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget | null;
}

const statusConfig = {
  draft: { label: "Rascunho", color: "badge-ghost", icon: "lucide--file-edit" },
  sent: { label: "Enviado", color: "badge-info", icon: "lucide--send" },
  approved: { label: "Aprovado", color: "badge-success", icon: "lucide--check-circle" },
  rejected: { label: "Rejeitado", color: "badge-error", icon: "lucide--x-circle" },
  expired: { label: "Expirado", color: "badge-warning", icon: "lucide--clock" },
};

export function ViewBudgetModal({ isOpen, onClose, budget }: ViewBudgetModalProps) {
  if (!isOpen || !budget) return null;

  // Validate budget status to prevent runtime errors
  const statusInfo = statusConfig[budget.status];
  if (!statusInfo) {
    console.error(`Invalid budget status: ${budget.status}`);
    return null;
  }

  // TODO: Implement proper print functionality with custom print layout
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-bold text-2xl mb-2">{budget.title}</h3>
            <p className="text-base-content/60">Cliente: {budget.client}</p>
          </div>
          <span className={`badge ${statusInfo.color} badge-lg`}>
            <span className={`iconify ${statusInfo.icon} size-4 mr-2`} />
            {statusInfo.label}
          </span>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Descrição</h4>
          <p className="text-base-content/80">{budget.description}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-base-200 p-4 rounded-lg">
            <p className="text-xs text-base-content/60 mb-1">Criado em</p>
            <p className="font-semibold">
              {new Date(budget.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="bg-base-200 p-4 rounded-lg">
            <p className="text-xs text-base-content/60 mb-1">Válido até</p>
            <p className="font-semibold">
              {new Date(budget.validUntil).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Itens do Orçamento</h4>
          <div className="overflow-x-auto border border-base-300 rounded-lg">
            <table className="table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th className="text-center">Quantidade</th>
                  <th className="text-right">Preço Unitário</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {budget.items.map((item, index) => (
                  <tr key={`${budget._id}-item-${index}-${item.description.substring(0, 10)}`}>
                    <td>{item.description}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{item.unitPrice}</td>
                    <td className="text-right font-semibold">{item.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan={3} className="text-right">
                    Valor Total:
                  </td>
                  <td className="text-right text-xl">{budget.totalAmount}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Notes */}
        {budget.notes && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Observações</h4>
            <div className="bg-base-200 p-4 rounded-lg">
              <p className="text-base-content/80 whitespace-pre-wrap">{budget.notes}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="modal-action">
          <Button type="button" className="btn btn-ghost" onClick={onClose}>
            Fechar
          </Button>
          <Button type="button" className="btn btn-primary" onClick={handlePrint}>
            <span className="iconify lucide--printer size-4" />
            Imprimir
          </Button>
        </div>
      </div>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ViewBudgetModal } from "./view-budget-modal";
import { DeleteBudgetModal } from "./delete-budget-modal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes?: string;
}

interface AllBudgetsProps {
  budgets: Budget[];
}

const statusConfig = {
  draft: { label: "Rascunho", color: "badge-ghost", icon: "lucide--file-edit" },
  sent: { label: "Enviado", color: "badge-info", icon: "lucide--send" },
  approved: { label: "Aprovado", color: "badge-success", icon: "lucide--check-circle" },
  rejected: { label: "Rejeitado", color: "badge-error", icon: "lucide--x-circle" },
  expired: { label: "Expirado", color: "badge-warning", icon: "lucide--clock" },
};

type StatusFilter = "all" | Budget["status"];

export function AllBudgets({ budgets }: AllBudgetsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleView = (budget: Budget) => {
    setSelectedBudget(budget);
  };

  const handleDeleteClick = (budgetId: string, budgetTitle: string) => {
    setBudgetToDelete({ id: budgetId, title: budgetTitle });
  };

  const handleDeleteConfirm = async () => {
    if (!budgetToDelete) return;

    setIsDeleting(true);
    try {
      // TODO: Implementar a chamada da API para deletar o orçamento
      console.log("Deletando orçamento:", budgetToDelete.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBudgetToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar orçamento:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadPDF = (budget: Budget) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // PÁGINA 1 - CAPA
    // Fundo cinza claro
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Logo (simulado com texto)
    doc.setTextColor(242, 153, 74); // Laranja
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("UPCRAFT", 105, 40, { align: "center" });
    doc.setTextColor(74, 85, 104);
    doc.text("CREW", 105, 48, { align: "center" });

    // Linha horizontal
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);

    // Título principal
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("proposta", 105, 90, { align: "center" });
    doc.text("comercial", 105, 105, { align: "center" });

    // Subtítulo
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    const titleLines = doc.splitTextToSize(budget.title.toUpperCase(), 170);
    let subtitleY = 130;
    titleLines.forEach((line: string) => {
      doc.text(line, 105, subtitleY, { align: "center" });
      subtitleY += 8;
    });

    // Data
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.3);
    doc.rect(145, 255, 45, 10);
    doc.setFontSize(10);
    doc.text(new Date().toLocaleDateString("pt-BR"), 167.5, 261, { align: "center" });

    // PÁGINA 2 - QUEM SOMOS
    doc.addPage();
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Logo no topo
    doc.setTextColor(242, 153, 74);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("UPCRAFT", 175, 15);
    doc.setTextColor(74, 85, 104);
    doc.text("CREW", 175, 20);
    doc.setDrawColor(200, 200, 200);
    doc.line(165, 22, 195, 22);

    // Logo e título lateral
    doc.setTextColor(242, 153, 74);
    doc.setFontSize(16);
    doc.text("▲", 20, 45);
    doc.text("▲", 20, 50);
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Quem somos", 35, 50);

    // Linha divisória
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);

    // Textos "Quem Somos"
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);

    const paragraph1 = doc.splitTextToSize(
      "A UPCRAFT CREW É UMA AGÊNCIA DE DESENVOLVIMENTO DE SOFTWARE QUE ENTREGA SOLUÇÕES DIGITAIS PERSONALIZADAS, COMBINANDO DESIGN, TECNOLOGIA E ESTRATÉGIA.",
      170,
    );
    let yPos = 75;
    paragraph1.forEach((line: string) => {
      doc.text(line, 20, yPos);
      yPos += 6;
    });

    yPos += 8;
    const paragraph2 = doc.splitTextToSize(
      "NOSSA EQUIPE É FORMADA POR PROFISSIONAIS EXPERIENTES E COMPROMETIDOS COM A QUALIDADE, OFERECENDO PROJETOS SOB MEDIDA QUE UNEM ESTÉTICA, FUNCIONALIDADE E DESEMPENHO.",
      170,
    );
    paragraph2.forEach((line: string) => {
      doc.text(line, 20, yPos);
      yPos += 6;
    });

    yPos += 8;
    const paragraph3 = doc.splitTextToSize(
      "DESENVOLVEMOS DESDE SITES INSTITUCIONAIS E LANDING PAGES ATÉ APLICAÇÕES WEB COMPLEXAS, SEMPRE COM FOCO EM GERAR VALOR REAL PARA O CLIENTE E MAXIMIZAR O RETORNO SOBRE O INVESTIMENTO.",
      170,
    );
    paragraph3.forEach((line: string) => {
      doc.text(line, 20, yPos);
      yPos += 6;
    });

    // Número da página
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("3", pageWidth - 20, pageHeight - 15);

    // PÁGINA 3 - INFORMAÇÕES DO PROJETO
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Logo no topo
    doc.setTextColor(242, 153, 74);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("UPCRAFT", 175, 15);
    doc.setTextColor(74, 85, 104);
    doc.text("CREW", 175, 20);
    doc.setDrawColor(200, 200, 200);
    doc.line(165, 22, 195, 22);

    // Título da seção
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Proposta Comercial - " + budget.client, 20, 40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Cliente: " + budget.client, 20, 50);
    doc.text("Proponente: Upcraft Crew - Soluções Web", 20, 57);

    // Linha divisória
    doc.setDrawColor(150, 150, 150);
    doc.line(20, 62, 190, 62);

    // Descrição
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIÇÃO DO PROJETO", 20, 75);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(budget.description, 170);
    let descY = 83;
    descLines.forEach((line: string) => {
      doc.text(line, 20, descY);
      descY += 5;
    });

    // Informações de datas
    descY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("INFORMAÇÕES", 20, descY);
    doc.setFont("helvetica", "normal");
    descY += 8;
    doc.text(`Criado em: ${new Date(budget.createdAt).toLocaleDateString("pt-BR")}`, 25, descY);
    descY += 6;
    doc.text(`Válido até: ${new Date(budget.validUntil).toLocaleDateString("pt-BR")}`, 25, descY);
    descY += 6;
    doc.text(`Status: ${statusConfig[budget.status].label}`, 25, descY);

    // PÁGINA 3 - INVESTIMENTO
    doc.addPage();
    doc.setFillColor(60, 60, 60);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Logo
    doc.setTextColor(242, 153, 74);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("UPCRAFT", 175, 15);
    doc.setTextColor(200, 200, 200);
    doc.text("CREW", 175, 20);
    doc.setDrawColor(150, 150, 150);
    doc.line(165, 22, 195, 22);

    // Cabeçalho
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Proposta Comercial", 20, 40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Cliente: " + budget.client, 20, 48);
    doc.text("Proponente: Upcraft Crew - Soluções Web", 20, 55);
    doc.setDrawColor(150, 150, 150);
    doc.line(20, 60, 190, 60);

    // Tabela de investimento
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("INVESTIMENTO", 20, 75);

    const tableData = budget.items.map((item) => [
      item.description,
      item.quantity.toString(),
      item.unitPrice.toString(),
      item.total.toString(),
    ]);

    autoTable(doc, {
      startY: 85,
      body: tableData,
      theme: "plain",
      styles: {
        textColor: [255, 255, 255],
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [60, 60, 60],
        textColor: [200, 200, 200],
        fontStyle: "bold",
        lineWidth: 0.1,
        lineColor: [100, 100, 100],
      },
      bodyStyles: {
        fillColor: [60, 60, 60],
        lineWidth: 0.1,
        lineColor: [100, 100, 100],
      },
      footStyles: {
        fillColor: [60, 60, 60],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        lineWidth: 0.1,
        lineColor: [100, 100, 100],
      },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
    });

    // Informações adicionais
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("FORMA DE PAGAMENTO", 20, finalY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("• A VISTA", 25, finalY + 10);

    doc.setFont("helvetica", "bold");
    doc.text("Validade da Proposta", 20, finalY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(`Esta proposta é válida por 15 dias a partir da data de envio.`, 20, finalY + 33);

    // Observações
    if (budget.notes) {
      const notesY = finalY + 50;
      doc.setFont("helvetica", "bold");
      doc.text("OBSERVAÇÕES", 20, notesY);
      doc.setFont("helvetica", "normal");
      const notesLines = doc.splitTextToSize(budget.notes, 170);
      let currentY = notesY + 8;
      notesLines.forEach((line: string) => {
        doc.text(line, 20, currentY);
        currentY += 5;
      });
    }

    // Rodapé
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("ATENCIOSAMENTE,", 105, pageHeight - 20, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text("UPCRAFT CREW - SOLUÇÕES WEB", 105, pageHeight - 13, { align: "center" });

    // Salvar PDF
    doc.save(`proposta-${budget.title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  // Filter budgets
  const filteredBudgets = useMemo(() => {
    return budgets.filter((budget) => {
      const matchesSearch =
        budget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        budget.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        budget.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || budget.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [budgets, searchQuery, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="input input-bordered flex items-center gap-2">
            <span className="iconify lucide--search size-4 text-base-content/60" />
            <input
              type="text"
              className="grow"
              placeholder="Buscar orçamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>
        <select
          className="select select-bordered w-full sm:w-48"
          value={statusFilter}
          onChange={(e) => {
            const value = e.target.value;
            if (
              value === "all" ||
              value === "draft" ||
              value === "sent" ||
              value === "approved" ||
              value === "rejected" ||
              value === "expired"
            ) {
              setStatusFilter(value);
            }
          }}
        >
          <option value="all">Todos os Status</option>
          <option value="draft">Rascunho</option>
          <option value="sent">Enviado</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Rejeitado</option>
          <option value="expired">Expirado</option>
        </select>
        <div className="join">
          <Button
            className={`btn join-item ${viewMode === "table" ? "btn-active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <span className="iconify lucide--table size-4" />
          </Button>
          <Button
            className={`btn join-item ${viewMode === "grid" ? "btn-active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <span className="iconify lucide--layout-grid size-4" />
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {filteredBudgets.length === 0 ? (
        <div className="text-center py-12 border border-base-300 rounded-lg">
          <span className="iconify lucide--file-text size-16 text-base-content/20 mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum orçamento encontrado</h3>
          <p className="text-base-content/60 text-sm">
            {searchQuery || statusFilter !== "all"
              ? "Tente ajustar os filtros"
              : "Crie seu primeiro orçamento para começar"}
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Orçamento</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Válido Até</th>
                <th>Criado Em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredBudgets.map((budget) => {
                const isExpiringSoon =
                  budget.status === "sent" &&
                  budget.validUntil - Date.now() <= 7 * 24 * 60 * 60 * 1000;

                return (
                  <tr key={budget._id} className="hover">
                    <td>
                      <div className="flex items-center gap-2">
                        <span
                          className={`iconify ${statusConfig[budget.status].icon} size-5 text-base-content/60`}
                        />
                        <div>
                          <p className="font-medium">{budget.title}</p>
                          <p className="text-xs text-base-content/60 line-clamp-1">
                            {budget.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{budget.client}</td>
                    <td className="font-semibold"></td>
                    <td>
                      <span className={`badge ${statusConfig[budget.status].color}`}>
                        {statusConfig[budget.status].label}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {isExpiringSoon && (
                          <span className="iconify lucide--alert-circle size-4 text-warning" />
                        )}
                        <span className={isExpiringSoon ? "text-warning font-medium" : ""}>
                          {new Date(budget.validUntil).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </td>
                    <td>{new Date(budget.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button className="btn btn-ghost btn-sm" onClick={() => handleView(budget)}>
                          <span className="iconify lucide--eye size-4" />
                        </Button>
                        <Button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDownloadPDF(budget)}
                        >
                          <span className="iconify lucide--file-down size-4" />
                        </Button>
                        <Button className="btn btn-ghost btn-sm" onClick={() => {}}>
                          <span className="iconify lucide--edit size-4" />
                        </Button>
                        <Button
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => handleDeleteClick(budget._id, budget.title)}
                        >
                          <span className="iconify lucide--trash-2 size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBudgets.map((budget) => {
            const isExpiringSoon =
              budget.status === "sent" && budget.validUntil - Date.now() <= 7 * 24 * 60 * 60 * 1000;

            return (
              <div
                key={budget._id}
                className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`iconify ${statusConfig[budget.status].icon} size-6 text-base-content/60`}
                    />
                    <span className={`badge ${statusConfig[budget.status].color} badge-sm`}>
                      {statusConfig[budget.status].label}
                    </span>
                  </div>
                  <h3 className="card-title text-base">{budget.title}</h3>
                  <p className="text-sm text-base-content/60">{budget.client}</p>
                  <p className="text-xs text-base-content/60 line-clamp-2 mt-2">
                    {budget.description}
                  </p>

                  <div className="divider my-2" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-base-content/60">Valor Total</p>
                      <p className="text-lg font-bold"></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-base-content/60">Válido até</p>
                      <p className={`text-sm font-medium ${isExpiringSoon ? "text-warning" : ""}`}>
                        {new Date(budget.validUntil).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="card-actions justify-between mt-4">
                    <Button
                      className="btn btn-sm btn-ghost text-error"
                      onClick={() => handleDeleteClick(budget._id, budget.title)}
                    >
                      <span className="iconify lucide--trash-2 size-4" />
                    </Button>
                    <div className="flex gap-2">
                      <Button className="btn btn-sm btn-ghost" onClick={() => handleView(budget)}>
                        <span className="iconify lucide--eye size-4" />
                        Ver
                      </Button>
                      <Button
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleDownloadPDF(budget)}
                      >
                        <span className="iconify lucide--file-down size-4" />
                        PDF
                      </Button>
                      <Button className="btn btn-sm btn-ghost" onClick={() => {}}>
                        <span className="iconify lucide--edit size-4" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Results Count */}
      {filteredBudgets.length > 0 && (
        <div className="text-center text-sm text-base-content/60">
          Mostrando {filteredBudgets.length} de {budgets.length} orçamentos
        </div>
      )}

      {/* Modals */}
      <ViewBudgetModal
        isOpen={!!selectedBudget}
        onClose={() => setSelectedBudget(null)}
        budget={selectedBudget}
      />

      <DeleteBudgetModal
        isOpen={!!budgetToDelete}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={handleDeleteConfirm}
        budgetTitle={budgetToDelete?.title || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}

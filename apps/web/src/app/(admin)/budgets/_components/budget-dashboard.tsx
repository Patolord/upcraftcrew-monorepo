"use client";

import { FileTextIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BudgetStats {
  total: number;
  draft: number;
  sent: number;
  approved: number;
  rejected: number;
  totalValue: number;
  approvedValue: number;
  conversionRate: number;
}

interface Budget {
  _id: string;
  title: string;
  client: string;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
  totalAmount: number;
  currency?: string;
  validUntil: number;
  createdAt: number;
}

interface BudgetDashboardProps {
  budgets: Budget[];
  stats?: BudgetStats;
}

const statusConfig = {
  draft: { label: "Rascunho", color: "badge-ghost" },
  sent: { label: "Enviado", color: "badge-info" },
  approved: { label: "Aprovado", color: "badge-success" },
  rejected: { label: "Rejeitado", color: "badge-error" },
  expired: { label: "Expirado", color: "badge-warning" },
};

function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function BudgetDashboard({ budgets, stats }: BudgetDashboardProps) {
  // Get recent budgets
  const recentBudgets = budgets.slice(0, 5);

  // Get budgets expiring soon (within 7 days)
  const now = Date.now();
  const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;
  const expiringSoon = budgets.filter(
    (b) => b.status === "sent" && b.validUntil <= sevenDaysFromNow && b.validUntil >= now,
  );

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        <div className="stats border text-center border-orange-500 rounded-md">
          <div className="stat-title pt-3 text-xl">Total Orçamentos</div>
          <div className="stat-value pt-2 pb-4 text-lg">{stats?.total || 0}</div>
        </div>
        <div className="stats border text-center border-orange-500 rounded-md">
          <div>
            <div className="stat-title pt-3 text-xl">Rascunho</div>
            <div className="stat-value pt-2 pb-4 text-lg">{stats?.draft || 0}</div>
          </div>
        </div>
        <div className="stats border text-center border-orange-500 rounded-md">
          <div>
            <div className="stat-title pt-3 text-xl">Enviados</div>
            <div className="stat-value pt-2 pb-4 text-lg">{stats?.sent || 0}</div>
          </div>
        </div>

        <div className="stats border text-center border-orange-500 rounded-md">
          <div>
            <div className="stat-title pt-3 text-xl">Rejeitados</div>
            <div className="stat-value pt-2 pb-4 text-lg">{stats?.rejected || 0}</div>
          </div>
        </div>
        <div className="stats border text-center border-orange-500 rounded-md">
          <div>
            <div className="stat-title pt-3 text-xl">Aprovados</div>
            <div className="stat-value pt-2 pb-4 text-lg">{stats?.approved || 0}</div>
          </div>
        </div>
        <div className="stats border text-center border-orange-500 rounded-md">
          <div>
            <div className="stat-title pt-3 text-xl">Valor Total</div>
            <div className="stat-value pt-2 pb-4 text-lg">
              {formatCurrency(stats?.totalValue || 0)}
            </div>
          </div>
        </div>
        <div className="stats border text-center border-orange-500 rounded-md">
          <div>
            <div className="stat-title pt-3 text-xl">Valor Aprovado</div>
            <div className="stat-value pt-2 pb-4 text-lg">
              {formatCurrency(stats?.approvedValue || 0)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Budgets */}
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="text-lg text-orange-500">Orçamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBudgets.length === 0 ? (
                <div className="text-center py-8">
                  <FileTextIcon className="h-12 w-12 text-base-content/20" />
                  <p className="text-sm text-base-content/60 mt-2">Nenhum orçamento criado</p>
                </div>
              ) : (
                recentBudgets.map((budget) => (
                  <div
                    key={budget._id}
                    className="flex items-center justify-between p-3 border border-base-300 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{budget.title}</p>
                      <p className="text-xs text-base-content/60">{budget.client}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(budget.totalAmount, budget.currency)}
                        </p>
                        <p className="text-xs text-base-content/60">
                          {new Date(budget.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <span className={`badge ${statusConfig[budget.status].color} badge-sm`}>
                        {statusConfig[budget.status].label}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="text-lg text-orange-500">Vencendo em Breve</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringSoon.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-base-content/60 mt-8">Nenhum orçamento vencendo</p>
                </div>
              ) : (
                expiringSoon.map((budget) => {
                  const daysUntil = Math.ceil((budget.validUntil - now) / (1000 * 60 * 60 * 24));
                  return (
                    <div
                      key={budget._id}
                      className="flex items-center justify-between p-3 border border-warning rounded-lg bg-warning/10"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{budget.title}</p>
                        <p className="text-xs text-base-content/60">{budget.client}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="badge badge-warning badge-sm">{daysUntil}d restantes</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

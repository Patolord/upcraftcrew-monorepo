"use client";

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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stats shadow border border-base-300">
          <div className="stat">
            <div className="stat-title text-xs">Total Orçamentos</div>
            <div className="stat-value text-2xl">{stats?.total || 0}</div>
            <div className="stat-desc">Todos os status</div>
          </div>
        </div>
        <div className="stats shadow border border-base-300">
          <div className="stat">
            <div className="stat-title text-xs">Aprovados</div>
            <div className="stat-value text-2xl text-success">{stats?.approved || 0}</div>
            <div className="stat-desc">Taxa: {stats?.conversionRate.toFixed(1) || 0}%</div>
          </div>
        </div>
        <div className="stats shadow border border-base-300">
          <div className="stat">
            <div className="stat-title text-xs">Valor Total</div>
            <div className="stat-value text-2xl">{stats?.totalValue || 0}</div>
            <div className="stat-desc">Todos os orçamentos</div>
          </div>
        </div>
        <div className="stats shadow border border-base-300">
          <div className="stat">
            <div className="stat-title text-xs">Valor Aprovado</div>
            <div className="stat-value text-2xl text-success">{stats?.approvedValue || 0}</div>
            <div className="stat-desc">Receita confirmada</div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Status dos Orçamentos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <span className="iconify lucide--file-edit size-8 text-base-content/60" />
              <div>
                <p className="text-2xl font-bold">{stats?.draft || 0}</p>
                <p className="text-xs text-base-content/60">Rascunho</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <span className="iconify lucide--send size-8 text-info" />
              <div>
                <p className="text-2xl font-bold">{stats?.sent || 0}</p>
                <p className="text-xs text-base-content/60">Enviados</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <span className="iconify lucide--check-circle size-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{stats?.approved || 0}</p>
                <p className="text-xs text-base-content/60">Aprovados</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <span className="iconify lucide--x-circle size-8 text-error" />
              <div>
                <p className="text-2xl font-bold">{stats?.rejected || 0}</p>
                <p className="text-xs text-base-content/60">Rejeitados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Budgets */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Orçamentos Recentes</h2>
            <div className="space-y-3">
              {recentBudgets.length === 0 ? (
                <div className="text-center py-8">
                  <span className="iconify lucide--file-text size-12 text-base-content/20" />
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
                        <p className="font-semibold">{budget.totalAmount}</p>
                        <p className="text-xs text-base-content/60">
                          {new Date(budget.createdAt).toLocaleDateString()}
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
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Vencendo em Breve</h2>
            <div className="space-y-3">
              {expiringSoon.length === 0 ? (
                <div className="text-center py-8">
                  <span className="iconify lucide--calendar-check size-12 text-base-content/20" />
                  <p className="text-sm text-base-content/60 mt-2">Nenhum orçamento vencendo</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}

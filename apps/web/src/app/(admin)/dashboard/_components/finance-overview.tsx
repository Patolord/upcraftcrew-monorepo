"use client";

interface FinanceOverviewProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}

export function FinanceOverview({
  totalRevenue,
  totalExpenses,
  netProfit,
  profitMargin,
}: FinanceOverviewProps) {
  const isProfit = netProfit >= 0;

  // Calculate percentages for visual bar
  const revenuePercent = totalRevenue > 0 ? 100 : 0;
  const expensesPercent = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-lg">Financial Overview</h2>
          <a
            href="/finance"
            className="btn btn-ghost btn-sm flex items-center"
            aria-label="View finance details"
          >
            View Details
            <span className="iconify lucide--arrow-right size-4 ml-1" aria-hidden="true" />
          </a>
        </div>

        {/* Net Profit Card */}
        <div className={`alert ${isProfit ? "alert-success" : "alert-error"} mb-4`}>
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs opacity-80">Net Profit</p>
              <p className="text-2xl font-bold">{Math.abs(netProfit)}</p>
            </div>
            <div className="text-right">
              <span
                className={`iconify ${
                  isProfit ? "lucide--trending-up" : "lucide--trending-down"
                } size-8`}
              />
              <p className="text-xs opacity-80 mt-1">{profitMargin.toFixed(1)}% margin</p>
            </div>
          </div>
        </div>

        {/* Revenue vs Expenses */}
        <div className="space-y-4">
          {/* Revenue */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="iconify lucide--arrow-down-circle size-4 text-success" />
                <span className="text-sm font-medium">Revenue</span>
              </div>
              <span className="text-sm font-bold text-success">{totalRevenue}</span>
            </div>
            <div className="relative w-full h-2 bg-base-300 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-success rounded-full transition-all"
                style={{ width: `${revenuePercent}%` }}
              />
            </div>
          </div>

          {/* Expenses */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="iconify lucide--arrow-up-circle size-4 text-error" />
                <span className="text-sm font-medium">Expenses</span>
              </div>
              <span className="text-sm font-bold text-error">{totalExpenses}</span>
            </div>
            <div className="relative w-full h-2 bg-base-300 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-error rounded-full transition-all"
                style={{ width: `${expensesPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-base-300">
          <div className="text-center p-2 bg-base-200 rounded-lg">
            <p className="text-xs text-base-content/60">Net {isProfit ? "Profit" : "Loss"}</p>
            <p className={`text-lg font-bold ${isProfit ? "text-success" : "text-error"}`}>
              {Math.abs(netProfit)}
            </p>
          </div>
          <div className="text-center p-2 bg-base-200 rounded-lg">
            <p className="text-xs text-base-content/60">Profit Margin</p>
            <p className={`text-lg font-bold ${isProfit ? "text-success" : "text-error"}`}>
              {profitMargin.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

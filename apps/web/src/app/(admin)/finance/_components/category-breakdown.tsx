"use client";

import { useMemo } from "react";
import type { Transaction, TransactionCategory } from "@/types/finance";
import { categoryConfig } from "@/app/(admin)/finance/config";

export function CategoryBreakdown({ transactions }: { transactions: Transaction[] }) {
  const categoryTotals = useMemo(() => {
    const totals = new Map<TransactionCategory, number>();

    transactions.forEach((t) => {
      if (t.type === "expense" && t.status === "completed") {
        const current = totals.get(t.category) || 0;
        totals.set(t.category, current + t.amount);
      }
    });

    return Array.from(totals.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const totalExpenses = categoryTotals.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h3 className="card-title text-base">Expenses by Category</h3>
        <div className="space-y-3 mt-2">
          {categoryTotals.slice(0, 6).map(({ category, amount }) => {
            const percentage = (amount / totalExpenses) * 100;
            const config = categoryConfig[category];

            return (
              <div key={category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`iconify ${config.icon} size-4`} />
                    <span>{config.label}</span>
                  </div>
                  <span className="font-medium">{amount.toFixed(0)}</span>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={percentage}
                  max="100"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

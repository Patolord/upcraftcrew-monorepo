"use client";

import type { Transaction } from "@/types/finance";

export function QuickStats({ transactions }: { transactions: Transaction[] }) {
  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const avgTransaction =
    transactions.length > 0
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
      : 0;

  const largestIncome =
    incomeTransactions.length > 0 ? Math.max(...incomeTransactions.map((t) => t.amount)) : 0;

  const largestExpense =
    expenseTransactions.length > 0 ? Math.max(...expenseTransactions.map((t) => t.amount)) : 0;

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h3 className="card-title text-base">Quick Stats</h3>
        <div className="space-y-3 mt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/60">Avg Transaction</span>
            <span className="font-medium">{avgTransaction.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/60">Largest Income</span>
            <span className="font-medium text-success">{largestIncome.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/60">Largest Expense</span>
            <span className="font-medium text-error">{largestExpense.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/60">Active Projects</span>
            <span className="font-medium">
              {new Set(transactions.filter((t) => t.projectId).map((t) => t.projectId)).size}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

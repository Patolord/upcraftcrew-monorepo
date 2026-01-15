"use client";

import type { Transaction } from "@/types/finance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    <Card className="border shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-base">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Avg Transaction</span>
            <span className="font-medium">${avgTransaction.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Largest Income</span>
            <span className="font-medium text-green-600 dark:text-green-500">
              ${largestIncome.toFixed(0)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Largest Expense</span>
            <span className="font-medium text-red-600 dark:text-red-500">
              ${largestExpense.toFixed(0)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Active Projects</span>
            <span className="font-medium">
              {new Set(transactions.filter((t) => t.projectId).map((t) => t.projectId)).size}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

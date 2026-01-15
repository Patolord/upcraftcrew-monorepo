"use client";

import { useMemo } from "react";
import type { Transaction, TransactionCategory } from "@/types/finance";
import { categoryConfig } from "@/app/(admin)/finance/config";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    <Card className="border shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-base">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
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
                  <span className="font-medium">${amount.toFixed(0)}</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

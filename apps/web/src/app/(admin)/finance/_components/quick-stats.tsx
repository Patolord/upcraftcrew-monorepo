"use client";

import type { Transaction } from "@/types/finance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

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
        <CardTitle className="text-base">Resumo Rápido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Média por Transação</span>
            <span className="font-medium">
              R$
              {avgTransaction.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Maior Receita</span>
            <span className="font-medium text-green-600 dark:text-green-500">
              R$
              {largestIncome.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Maior Despesa</span>
            <span className="font-medium text-red-600 dark:text-red-500">
              R$
              {largestExpense.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Projetos Ativos</span>
            <span className="font-medium">
              {new Set(transactions.filter((t) => t.projectId).map((t) => t.projectId)).size}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingIncome: number;
  pendingExpenses: number;
}

interface FinancialSummaryCardsProps {
  summary: FinancialSummary;
  totalTransactions: number;
  pendingTransactions: number;
}

const formatLargeNumber = (
  value: number,
  formatFn: (val: number, opts?: Intl.NumberFormatOptions) => string,
) => {
  if (Math.abs(value) >= 1000) {
    return `${formatFn(value / 1000, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}k`;
  }
  return formatFn(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export function FinancialSummaryCards({
  summary,
  totalTransactions,
  pendingTransactions,
}: FinancialSummaryCardsProps) {
  const profitMargin =
    summary.totalIncome > 0 ? ((summary.netProfit / summary.totalIncome) * 100).toFixed(0) : "0";

  const stats = [
    {
      title: "Receita Total",
      value: formatLargeNumber(summary.totalIncome, (val) => val.toLocaleString()),
      className: "text-green-600 dark:text-green-500",
      description: "",
    },
    {
      title: "Despesas Totais",
      value: formatLargeNumber(summary.totalExpenses, (val) => val.toLocaleString()),
      className: "text-red-600 dark:text-red-500",
      description: "",
    },
    {
      title: "Lucro Líquido",
      value: formatLargeNumber(summary.netProfit, (val) => val.toLocaleString()),
      className:
        summary.netProfit >= 0
          ? "text-green-600 dark:text-green-500"
          : "text-red-600 dark:text-red-500",
      description: `${summary.netProfit >= 0 ? "Lucro" : "Prejuízo"} no período`,
    },
    {
      title: "Transações",
      value: totalTransactions.toString(),
      className: "",
      description: `${pendingTransactions} pendentes`,
    },
    {
      title: "Margem de Lucro",
      value: `${profitMargin}%`,
      className: "",
      description: "Eficiência da receita",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border shadow-sm rounded-lg">
          <CardHeader>
            <CardTitle className="text-xs text-center">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl text-center font-semibold", stat.className)}>
              {stat.value}
            </div>
            {stat.description && (
              <div className="text-xs text-muted-foreground mt-1 text-center">
                {stat.description}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

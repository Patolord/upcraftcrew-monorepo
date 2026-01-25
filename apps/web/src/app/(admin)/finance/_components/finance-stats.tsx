"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon, WalletIcon, ReceiptIcon } from "lucide-react";
import React from "react";

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingIncome: number;
  pendingExpenses: number;
}

interface FinanceStatsProps {
  summary: FinancialSummary;
  totalTransactions: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function FinanceStats({ summary, totalTransactions }: FinanceStatsProps) {
  // Calculate percentage changes (mock data for now)
  const incomeChange = 12;
  const expensesChange = -8;
  const profitChange = 25;
  const transactionsChange = 15;

  const statCards = [
    {
      key: "income",
      label: "Total",
      icon: TrendingUpIcon,
      iconBg: "bg-emerald-500",
      value: formatCurrency(summary.totalIncome),
      change: incomeChange,
    },
    {
      key: "expenses",
      label: "Despesas",
      icon: TrendingDownIcon,
      iconBg: "bg-rose-500",
      value: formatCurrency(summary.totalExpenses),
      change: expensesChange,
    },
    {
      key: "profit",
      label: "Lucro",
      icon: WalletIcon,
      iconBg: "bg-blue-500",
      value: formatCurrency(summary.netProfit),
      change: profitChange,
    },
    {
      key: "transactions",
      label: "Transações",
      icon: ReceiptIcon,
      iconBg: "bg-orange-400",
      value: totalTransactions.toString(),
      change: transactionsChange,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const isPositiveChange = card.change >= 0;

        return (
          <Card key={card.key} className="rounded-xl bg-white shadow-sm ring-0 py-0">
            <CardContent className="flex items-center gap-4 p-4">
              {/* Icon */}
              <div className={`${card.iconBg} p-3 rounded-xl`}>
                <Icon className="size-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{card.value}</span>
                  <span
                    className={`text-xs font-medium ${
                      isPositiveChange ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isPositiveChange ? "+" : ""}
                    {card.change}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

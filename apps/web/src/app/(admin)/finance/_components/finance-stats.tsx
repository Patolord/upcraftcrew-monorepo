"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon, WalletIcon, ReceiptIcon } from "lucide-react";
import type { CurrencyCode } from "@/components/ui/currency-switch";
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
  currency: CurrencyCode;
}

function formatCurrency(value: number, currency: CurrencyCode) {
  const locale = currency === "BRL" ? "pt-BR" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function FinanceStats({ summary, totalTransactions, currency }: FinanceStatsProps) {
  const statCards = [
    {
      key: "income",
      label: "Total",
      icon: TrendingUpIcon,
      iconBg: "bg-emerald-500",
      value: formatCurrency(summary.totalIncome, currency),
    },
    {
      key: "expenses",
      label: "Despesas",
      icon: TrendingDownIcon,
      iconBg: "bg-rose-500",
      value: formatCurrency(summary.totalExpenses, currency),
    },
    {
      key: "profit",
      label: "Lucro",
      icon: WalletIcon,
      iconBg: summary.netProfit >= 0 ? "bg-blue-500" : "bg-red-500",
      value: formatCurrency(summary.netProfit, currency),
    },
    {
      key: "transactions",
      label: "Transações",
      icon: ReceiptIcon,
      iconBg: "bg-orange-400",
      value: totalTransactions.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;

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
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

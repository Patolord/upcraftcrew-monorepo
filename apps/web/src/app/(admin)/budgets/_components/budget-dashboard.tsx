"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileTextIcon, CheckCircleIcon, DollarSignIcon, TrendingUpIcon } from "lucide-react";
import type { CurrencyCode } from "@/components/ui/currency-switch";
import React from "react";

interface BudgetStats {
  total: number;
  draft: number;
  sent: number;
  approved: number;
  rejected: number;
  cancelled: number;
  totalValue: number;
  approvedValue: number;
  conversionRate: number;
}

interface BudgetDashboardProps {
  stats?: BudgetStats;
  currency?: CurrencyCode;
}

function formatCurrencyValue(value: number, currency: CurrencyCode = "BRL"): string {
  const locale = currency === "BRL" ? "pt-BR" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function BudgetDashboard({ stats, currency = "BRL" }: BudgetDashboardProps) {
  const safeStats: BudgetStats = stats || {
    total: 0,
    draft: 0,
    sent: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    totalValue: 0,
    approvedValue: 0,
    conversionRate: 0,
  };

  const statCards = [
    {
      key: "total",
      label: "Total Orçamentos",
      icon: FileTextIcon,
      iconBg: "bg-teal-500",
      value: safeStats.total,
      change: 12,
    },
    {
      key: "approved",
      label: "Aprovados",
      icon: CheckCircleIcon,
      iconBg: "bg-emerald-500",
      value: safeStats.approved,
      change: Math.round(safeStats.conversionRate),
    },
    {
      key: "totalValue",
      label: "Valor Total",
      icon: DollarSignIcon,
      iconBg: "bg-orange-400",
      value: formatCurrencyValue(safeStats.totalValue, currency),
      change: 24,
    },
    {
      key: "approvedValue",
      label: "Valor Aprovado",
      icon: TrendingUpIcon,
      iconBg: "bg-orange-500",
      value: formatCurrencyValue(safeStats.approvedValue, currency),
      change: 32,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {statCards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.key} className="rounded-xl bg-white shadow-sm ring-0 py-0">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`${card.iconBg} p-3 rounded-xl`}>
                <Icon className="size-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground truncate">{card.value}</span>
                  <span className="text-xs text-green-500 font-medium">+{card.change}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

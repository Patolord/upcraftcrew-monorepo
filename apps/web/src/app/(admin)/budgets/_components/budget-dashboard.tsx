"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileTextIcon, CheckCircleIcon, DollarSignIcon, TrendingUpIcon } from "lucide-react";
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
}

function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const statCards = [
  {
    key: "total",
    label: "Total Orçamentos",
    icon: FileTextIcon,
    iconBg: "bg-teal-500",
    getValue: (stats: BudgetStats) => stats.total,
    getChange: () => 12,
  },
  {
    key: "approved",
    label: "Aprovados",
    icon: CheckCircleIcon,
    iconBg: "bg-emerald-500",
    getValue: (stats: BudgetStats) => stats.approved,
    getChange: (stats: BudgetStats) => Math.round(stats.conversionRate),
  },
  {
    key: "totalValue",
    label: "Valor Total",
    icon: DollarSignIcon,
    iconBg: "bg-orange-400",
    getValue: (stats: BudgetStats) => formatCurrency(stats.totalValue),
    getChange: () => 24,
  },
  {
    key: "approvedValue",
    label: "Valor Aprovado",
    icon: TrendingUpIcon,
    iconBg: "bg-orange-500",
    getValue: (stats: BudgetStats) => formatCurrency(stats.approvedValue),
    getChange: () => 32,
  },
];

export function BudgetDashboard({ stats }: BudgetDashboardProps) {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = card.getValue(safeStats);
        const change = card.getChange(safeStats);

        return (
          <Card key={card.key} className="rounded-xl bg-white shadow-sm ring-0 py-0">
            <CardContent className="flex items-center gap-4 p-4">
              {/* Icon */}
              <div className={`${card.iconBg} p-3 rounded-xl`}>
                <Icon className="size-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground truncate">{value}</span>
                  <span className="text-xs text-green-500 font-medium">+{change}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

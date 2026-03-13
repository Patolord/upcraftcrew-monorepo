"use client";

import { FolderKanbanIcon, UsersIcon, TrendingUpIcon, DollarSignIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CurrencyCode } from "@/components/ui/currency-switch";
import React from "react";

interface DashboardStatsProps {
  stats: {
    activeProjects: number;
    activeMembers: number;
    totalRevenue: number;
    netProfit: number;
    avgProgress: number;
  };
  totalProjects: number;
  totalMembers: number;
  currency?: CurrencyCode;
}

function formatCompact(value: number, currency: CurrencyCode = "BRL"): string {
  const symbol = currency === "BRL" ? "R$" : "$";
  if (Math.abs(value) >= 1000) {
    return `${symbol}${(value / 1000).toFixed(0)}k`;
  }
  return `${symbol}${value.toFixed(0)}`;
}

export function DashboardStats({
  stats,
  totalProjects,
  totalMembers,
  currency = "BRL",
}: DashboardStatsProps) {
  const statCards = [
    {
      key: "projects",
      label: "Projetos",
      icon: FolderKanbanIcon,
      iconBg: "bg-teal-500",
      value: totalProjects,
      change: 55,
    },
    {
      key: "members",
      label: "Membros",
      icon: UsersIcon,
      iconBg: "bg-blue-500",
      value: totalMembers,
      change: 8,
    },
    {
      key: "revenue",
      label: "Receitas",
      icon: TrendingUpIcon,
      iconBg: "bg-orange-400",
      value: formatCompact(stats.totalRevenue, currency),
      change: 2,
    },
    {
      key: "profit",
      label: "Lucro",
      icon: DollarSignIcon,
      iconBg: "bg-orange-500",
      value: formatCompact(stats.netProfit, currency),
      change: stats.totalRevenue > 0 ? Math.round((stats.netProfit / stats.totalRevenue) * 100) : 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.key} className="rounded-xl bg-white shadow-sm ring-0 py-0">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`${card.iconBg} p-3 rounded-xl`}>
                <Icon className="size-6 text-white" />
              </div>

              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{card.value}</span>
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

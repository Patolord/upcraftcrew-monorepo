"use client";

import { FolderKanban, Users, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
}

const statCards = [
  {
    key: "projects",
    label: "Projects",
    icon: FolderKanban,
    iconBg: "bg-teal-500",
    getValue: (stats: DashboardStatsProps["stats"], totalProjects: number) => totalProjects,
    getChange: () => 55,
  },
  {
    key: "members",
    label: "Membros",
    icon: Users,
    iconBg: "bg-blue-500",
    getValue: (stats: DashboardStatsProps["stats"], _: number, totalMembers: number) =>
      totalMembers,
    getChange: () => 8,
  },
  {
    key: "revenue",
    label: "Revenue",
    icon: TrendingUp,
    iconBg: "bg-orange-400",
    getValue: (stats: DashboardStatsProps["stats"]) => `${(stats.totalRevenue / 1000).toFixed(0)}k`,
    getChange: () => 2,
  },
  {
    key: "profit",
    label: "Profit",
    icon: DollarSign,
    iconBg: "bg-orange-500",
    getValue: (stats: DashboardStatsProps["stats"]) => (stats.netProfit / 1000).toFixed(0),
    getChange: (stats: DashboardStatsProps["stats"]) =>
      stats.totalRevenue > 0 ? Math.round((stats.netProfit / stats.totalRevenue) * 100) : 0,
  },
];

export function DashboardStats({ stats, totalProjects, totalMembers }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = card.getValue(stats, totalProjects, totalMembers);
        const change = card.getChange(stats);

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
                  <span className="text-2xl font-bold text-foreground">{value}</span>
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

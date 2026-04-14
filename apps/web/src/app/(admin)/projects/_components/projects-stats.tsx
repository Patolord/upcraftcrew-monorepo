"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FolderKanbanIcon,
  PlayCircleIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
} from "lucide-react";
import React from "react";

export type ProjectStatsPayload = {
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
};

interface ProjectsStatsProps {
  stats: ProjectStatsPayload | undefined;
}

export function ProjectsStats({ stats }: ProjectsStatsProps) {
  const loading = stats === undefined;

  const statCards = [
    {
      key: "total",
      label: "Total de Projetos",
      icon: FolderKanbanIcon,
      iconBg: "bg-teal-500",
      value: stats?.total ?? 0,
      change: 55,
    },
    {
      key: "inProgress",
      label: "Em Progresso",
      icon: PlayCircleIcon,
      iconBg: "bg-blue-500",
      value: stats?.inProgress ?? 0,
      change: 12,
    },
    {
      key: "completed",
      label: "Concluído",
      icon: CheckCircle2Icon,
      iconBg: "bg-emerald-500",
      value: stats?.completed ?? 0,
      change: 8,
    },
    {
      key: "planning",
      label: "Planejamento",
      icon: ClipboardListIcon,
      iconBg: "bg-orange-400",
      value: stats?.planning ?? 0,
      change: 15,
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
                  {loading ? (
                    <Skeleton className="h-8 w-12 rounded-md" />
                  ) : (
                    <span className="text-2xl font-bold text-foreground">{card.value}</span>
                  )}
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

"use client";

import type { Project } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderKanbanIcon,
  PlayCircleIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
} from "lucide-react";
import React from "react";

interface ProjectsStatsProps {
  projects: Project[];
}

export function ProjectsStats({ projects }: ProjectsStatsProps) {
  const totalProjects = projects.length;
  const inProgress = projects.filter((p) => p.status === "in-progress").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const planning = projects.filter((p) => p.status === "planning").length;

  const statCards = [
    {
      key: "total",
      label: "Total de Projetos",
      icon: FolderKanbanIcon,
      iconBg: "bg-teal-500",
      value: totalProjects,
      change: 55,
    },
    {
      key: "inProgress",
      label: "Em Progresso",
      icon: PlayCircleIcon,
      iconBg: "bg-blue-500",
      value: inProgress,
      change: 12,
    },
    {
      key: "completed",
      label: "Concluído",
      icon: CheckCircle2Icon,
      iconBg: "bg-emerald-500",
      value: completed,
      change: 8,
    },
    {
      key: "planning",
      label: "Executar",
      icon: ClipboardListIcon,
      iconBg: "bg-orange-400",
      value: planning,
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
              {/* Icon */}
              <div className={`${card.iconBg} p-3 rounded-xl`}>
                <Icon className="size-6 text-white" />
              </div>

              {/* Content */}
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

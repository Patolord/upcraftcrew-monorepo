"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UsersIcon, CircleDotIcon, FolderKanbanIcon, ClockIcon } from "lucide-react";
import { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import React from "react";

type TeamMemberWithProjects = Doc<"users"> & {
  projects: (Doc<"projects"> | null)[];
};

interface TeamStatsProps {
  teamMembers: TeamMemberWithProjects[];
}

export function TeamStats({ teamMembers }: TeamStatsProps) {
  const totalMembers = teamMembers.length;
  const onlineCount = teamMembers.filter((m) => m.status === "online").length;
  const busyCount = teamMembers.filter((m) => m.status === "busy").length;

  // Count unique active projects across all members
  const activeProjectIds = new Set<string>();
  teamMembers.forEach((member) => {
    member.projects?.forEach((project) => {
      if (project && project._id) {
        activeProjectIds.add(project._id);
      }
    });
  });
  const activeProjects = activeProjectIds.size;

  const statCards = [
    {
      key: "total",
      label: "Total",
      icon: UsersIcon,
      iconBg: "bg-teal-500",
      value: totalMembers,
      change: 8,
    },
    {
      key: "online",
      label: "Online",
      icon: CircleDotIcon,
      iconBg: "bg-emerald-500",
      value: onlineCount,
      change: 12,
    },
    {
      key: "projects",
      label: "Projetos Ativos",
      icon: FolderKanbanIcon,
      iconBg: "bg-orange-400",
      value: activeProjects,
      change: 15,
    },
    {
      key: "busy",
      label: "Ocupado",
      icon: ClockIcon,
      iconBg: "bg-red-500",
      value: busyCount,
      change: 5,
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

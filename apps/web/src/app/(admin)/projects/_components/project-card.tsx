"use client";

import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project, ProjectStatus } from "@/types/project";
import { ChevronDownIcon, EyeIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import React from "react";

/** Alinhado às cores dos ícones em `projects-stats.tsx` (orange-400, blue-500, emerald-500). */
const statusConfig = {
  planning: {
    label: "Planejamento",
    badgeClassName:
      "border-transparent bg-orange-400 text-white hover:bg-orange-400/90 [&>svg]:text-white",
  },
  "in-progress": {
    label: "Em Progresso",
    badgeClassName:
      "border-transparent bg-blue-500 text-white hover:bg-blue-500/90 [&>svg]:text-white",
  },
  completed: {
    label: "Concluído",
    badgeClassName:
      "border-transparent bg-emerald-500 text-white hover:bg-emerald-500/90 [&>svg]:text-white",
  },
} as const;

const statusOptions = [
  { value: "planning" as const, label: "Planejamento" },
  { value: "in-progress" as const, label: "Em Progresso" },
  { value: "completed" as const, label: "Concluído" },
];

const budgetFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatScheduleDate(value: string | number | undefined): string {
  if (value === undefined || value === null) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", {
    month: "short",
    day: "numeric",
  });
}

export function ProjectCard({ project }: { project: Project }) {
  const updateProjectStatus = useMutation(api.projects.updateProjectStatus);

  const statusKey = (project.status ?? "planning") as keyof typeof statusConfig;
  const status = statusConfig[statusKey] ?? statusConfig.planning;

  const projectId = project._id as Id<"projects"> | undefined;

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    if (!projectId) {
      toast.error("Não foi possível atualizar o status");
      return;
    }
    try {
      await updateProjectStatus({ id: projectId, status: newStatus });
      toast.success(`Status atualizado para ${statusConfig[newStatus].label}`);
    } catch (error) {
      console.error("Failed to update project status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const budgetFormatted =
    project.budget !== undefined && project.budget !== null
      ? budgetFormatter.format(project.budget)
      : null;

  const startLabel = formatScheduleDate(project.startDate);
  const endLabel = project.endDate ? formatScheduleDate(project.endDate) : "";
  const scheduleText =
    startLabel && endLabel ? `${startLabel} – ${endLabel}` : startLabel || endLabel || "—";

  return (
    <Card className="border border-border rounded-md hover:shadow-lg transition-shadow flex flex-col h-full min-w-0 overflow-hidden gap-1">
      <CardHeader className="p-4 md:p-6 min-w-0 pb-0">
        <div className="flex items-start justify-between gap-2 md:gap-3 min-w-0">
          <div className="flex-1 min-w-0 overflow-hidden">
            <CardTitle className="text-base md:text-lg truncate min-w-0" title={project.name}>
              {project.name}
            </CardTitle>
            {project.client && (
              <CardDescription
                className="mt-0.5 mb-0 text-sm truncate min-w-0 leading-tight"
                title={project.client}
              >
                {project.clientId ? (
                  <Link
                    href={`/clients/${project.clientId}`}
                    className="hover:text-orange-500 hover:underline truncate block min-w-0"
                  >
                    {project.client}
                  </Link>
                ) : (
                  project.client
                )}
              </CardDescription>
            )}
          </div>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={!projectId}>
                <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                  <Badge
                    variant="outline"
                    className={cn(
                      "cursor-pointer flex items-center gap-1 text-[10px] md:text-xs whitespace-nowrap shadow-none",
                      status.badgeClassName,
                    )}
                  >
                    {status.label}
                    <ChevronDownIcon className="h-3 w-3" />
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={project.status === option.value ? "bg-muted" : ""}
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        "mr-2 text-[10px] md:text-xs shadow-none",
                        statusConfig[option.value].badgeClassName,
                      )}
                    >
                      {option.label}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 md:p-6 pt-0 md:pt-0">
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mt-0 leading-snug">
          {project.description}
        </p>

        <div className="mt-3 md:mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] md:text-xs text-muted-foreground">Progresso</span>
            <span className="text-[10px] md:text-xs font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-1.5 md:h-2 [&>div]:bg-base-300" />
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-3 mt-3 md:mt-4 min-w-0">
          {budgetFormatted !== null && (
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Orçamento</p>
              <p className="text-xs md:text-sm font-medium truncate" title={budgetFormatted}>
                {budgetFormatted}
              </p>
            </div>
          )}
          <div className={cn("min-w-0 overflow-hidden", budgetFormatted === null && "col-span-2")}>
            <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Cronograma</p>
            <p className="text-xs md:text-sm font-medium truncate" title={scheduleText}>
              {scheduleText}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto p-4 md:p-6 pt-0 md:pt-0 flex flex-row items-center justify-between gap-2 min-w-0">
        {project.manager && project.manager.name ? (
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <span className="text-[10px] md:text-xs text-muted-foreground shrink-0">
              Responsável:
            </span>
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <Avatar className="w-5 h-5 md:w-6 md:h-6 shrink-0">
                <AvatarImage src={project.manager.imageUrl} alt={project.manager.name} />
                <AvatarFallback className="text-[10px] md:text-xs">
                  {project.manager.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className="text-[10px] md:text-xs font-medium truncate min-w-0"
                title={project.manager.name}
              >
                {project.manager.name}
              </span>
            </div>
          </div>
        ) : (
          <span className="flex-1 min-w-0" aria-hidden />
        )}
        <Link href={`/projects/${project._id}`} className="shrink-0">
          <Button className="bg-orange-500 text-white rounded-md text-[10px] md:text-xs h-7 md:h-8 px-2 md:px-3">
            <EyeIcon className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
            <span className="hidden sm:inline">Visualizar</span>
            <span className="sm:hidden">Ver</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

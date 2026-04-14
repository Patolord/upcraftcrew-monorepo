"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import {
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  PaperclipIcon,
  ClipboardListIcon,
  GaugeIcon,
  PackageIcon,
  PlayCircleIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React from "react";
import type { Project, TeamMember } from "@/types/project";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface ProjectDashboardProps {
  project: Project & { _id: Id<"projects"> };
}

const statusConfig = {
  planning: {
    label: "Planejamento",
    variant: "secondary" as const,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    iconBg: "bg-orange-400",
  },
  "in-progress": {
    label: "Em progresso",
    variant: "default" as const,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    iconBg: "bg-blue-500",
  },
  completed: {
    label: "Concluído",
    variant: "success" as const,
    color: "bg-green-100 text-green-700 border-green-200",
    iconBg: "bg-emerald-500",
  },
};

const priorityConfig = {
  low: { label: "Baixa", color: "text-gray-700", iconBg: "bg-slate-500" },
  medium: { label: "Média", color: "text-blue-700", iconBg: "bg-blue-500" },
  high: { label: "Alta", color: "text-amber-700", iconBg: "bg-amber-500" },
  urgent: { label: "Urgente", color: "text-red-700", iconBg: "bg-red-500" },
};

/** Altura fixa igual para os três cards da linha — grande o suficiente para o cronograma caber sem scroll */
const ROW_H = "h-[280px]";
/** Altura alinhada entre progresso e eventos */
const LOWER_PANEL_MIN_H = "min-h-[320px]";

function personDisplayName(member: TeamMember): string {
  if (member.name?.trim()) return member.name;
  return [member.firstName, member.lastName].filter(Boolean).join(" ").trim() || "—";
}

function personInitials(member: TeamMember): string {
  if (member.firstName && member.lastName) {
    return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;
  }
  const n = member.name?.trim();
  if (n) {
    const parts = n.split(/\s+/);
    if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`;
    return n.slice(0, 2).toUpperCase();
  }
  return "?";
}

export function ProjectDashboard({ project }: ProjectDashboardProps) {
  const events = useQuery(api.schedule.getEventsByProject, {
    projectId: project._id,
  });

  const status = statusConfig[project.status] ?? statusConfig.planning;
  const priority = priorityConfig[project.priority] ?? priorityConfig.medium;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const budgetFormatted =
    project.budget !== undefined && project.budget !== null
      ? new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(project.budget)
      : null;

  const timeline = useMemo(() => {
    const now = Date.now();
    const start =
      typeof project.startDate === "string"
        ? new Date(project.startDate).getTime()
        : project.startDate;
    const end = project.endDate
      ? typeof project.endDate === "string"
        ? new Date(project.endDate).getTime()
        : project.endDate
      : now;
    const total = end - start;
    const elapsed = now - start;
    const percentage = total > 0 ? Math.min((elapsed / total) * 100, 100) : 0;
    const isOverdue = now > end;

    return {
      percentage,
      isOverdue,
    };
  }, [project]);

  const StatusIcon = ClipboardListIcon;

  return (
    <div className="space-y-6">
      {/* Métricas — ícone + conteúdo centralizados na altura do card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <Card className="rounded-xl border border-orange-100 bg-white shadow-sm py-0 flex flex-col min-h-[104px]">
          <CardContent className="flex flex-1 items-center gap-4 px-4 py-4">
            <div className={cn("p-3 rounded-xl shrink-0", status.iconBg)}>
              <StatusIcon className="size-6 text-white" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-sm text-muted-foreground font-medium">Status</p>
              <div className="mt-1">
                <Badge variant={status.variant} className={`${status.color} border text-sm`}>
                  {status.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-orange-100 bg-white shadow-sm py-0 flex flex-col min-h-[104px]">
          <CardContent className="flex flex-1 items-center gap-3 px-4 py-3">
            <div className={cn("p-2 rounded-lg shrink-0", priority.iconBg)}>
              <GaugeIcon className="size-5 text-white" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
              <p className="text-xs text-muted-foreground font-medium">Prioridade</p>
              <p className={cn("text-base font-bold leading-tight tracking-tight", priority.color)}>
                {priority.label}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-orange-100 bg-white shadow-sm py-0 flex flex-col min-h-[104px]">
          <CardContent className="flex flex-1 items-center gap-4 px-4 py-4">
            <div className="p-3 rounded-xl shrink-0 bg-teal-500">
              <PackageIcon className="size-6 text-white" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-sm text-muted-foreground font-medium">Orçamento</p>
              <p className="text-2xl font-bold text-foreground mt-0.5 tabular-nums">
                {budgetFormatted ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-orange-100 bg-white shadow-sm py-0 flex flex-col min-h-[104px]">
          <CardContent className="flex flex-1 items-center gap-4 px-4 py-4">
            <div className="p-3 rounded-xl shrink-0 bg-orange-500">
              <PlayCircleIcon className="size-6 text-white" />
            </div>
            <div className="flex-1 min-w-0 flex flex-row items-center justify-start gap-3">
              <div className="flex flex-col justify-center">
                <p className="text-sm text-muted-foreground font-medium">Progresso</p>
                <p className="text-2xl font-bold text-foreground tabular-nums leading-none mt-0.5">
                  {project.progress}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Descrição e equipe: altura útil + scroll. Cronograma: altura só do conteúdo (até após “dias”) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <Card className={cn("lg:col-span-5 rounded-lg border border-orange-100 flex flex-col", ROW_H)}>
          <CardHeader className="shrink-0 pb-2 pt-4 px-5">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <FileTextIcon className="h-[18px] w-[18px] text-orange-500 shrink-0" />
              Descrição do projeto
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 flex flex-col px-5 pb-4 pt-0 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3 text-muted-foreground leading-relaxed text-sm">
              <p>{project.description}</p>
              {project.notes && (
                <div className="pt-3 border-t border-border">
                  <h4 className="font-semibold text-foreground text-sm mb-1.5">Observações</h4>
                  <p className="whitespace-pre-wrap">{project.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={cn("lg:col-span-4 rounded-lg border border-orange-100 flex flex-col", ROW_H)}>
          <CardHeader className="shrink-0 pb-2 pt-4 px-5">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <CalendarIcon className="h-[18px] w-[18px] text-orange-500 shrink-0" />
              Cronograma
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4 pt-0">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-0.5">
                  Data de início
                </p>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {formatDate(project.startDate as number)}
                </p>
              </div>
              {project.endDate && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-0.5">
                    Data de término
                  </p>
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {formatDate(project.endDate as number)}
                  </p>
                </div>
              )}
              <div className="pt-1">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-0.5">
                  Duração
                </p>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {project.endDate
                    ? `${Math.ceil(
                        ((project.endDate as number) - (project.startDate as number)) /
                          (1000 * 60 * 60 * 24),
                      )} dias`
                    : "Em andamento"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn("lg:col-span-3 rounded-lg border border-orange-100 flex flex-col", ROW_H)}>
          <CardHeader className="shrink-0 pb-2 pt-4 px-5">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <UsersIcon className="h-[18px] w-[18px] text-orange-500 shrink-0" />
              Equipe
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 flex flex-col px-5 pb-4 pt-0 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
              {project.manager && (
                <div className="pb-3">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Responsável</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-orange-200 shrink-0">
                      <AvatarImage
                        src={project.manager.imageUrl}
                        alt={personDisplayName(project.manager)}
                      />
                      <AvatarFallback className="bg-orange-500 text-white">
                        {personInitials(project.manager)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {personDisplayName(project.manager)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.manager.email ?? ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {project.team && project.team.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Membros</p>
                  <div className="space-y-3">
                    {project.team.map((member) => (
                      <div key={member._id || member.email} className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarImage src={member.imageUrl} alt={personDisplayName(member)} />
                          <AvatarFallback className="bg-pink-400 text-white text-xs">
                            {personInitials(member)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{personDisplayName(member)}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.email ?? ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!project.manager && (!project.team || project.team.length === 0) && (
                <p className="text-sm text-muted-foreground">Nenhum membro associado ao projeto.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {project.files && project.files.length > 0 && (
        <Card className="border border-orange-100 rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <PaperclipIcon className="h-5 w-5 text-orange-500" />
              Arquivos anexados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {project.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-orange-100">
                      <PaperclipIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(file.url, "_blank")}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    Baixar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progresso e eventos — mesma altura, scroll interno */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <Card
          className={cn(
            "border border-orange-100 rounded-lg flex flex-col",
            LOWER_PANEL_MIN_H,
          )}
        >
          <CardHeader className="shrink-0 pb-2">
            <CardTitle className="text-lg font-semibold">Progresso do projeto</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-y-auto pt-0">
            <div className="space-y-5 pr-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">Conclusão</span>
                  <span className="text-sm font-bold tabular-nums">{project.progress}%</span>
                </div>
                <Progress
                  className="w-full h-4 [&>div]:bg-orange-100"
                  value={project.progress}
                  max={100}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">Linha do tempo</span>
                  <span className="text-sm font-bold tabular-nums">
                    {timeline.percentage.toFixed(0)}%
                  </span>
                </div>
                <Progress
                  className={cn(
                    "w-full h-4 [&>div]:bg-orange-100",
                    timeline.isOverdue ? "text-red-500" : "text-blue-500",
                  )}
                  value={timeline.percentage}
                  max={100}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border border-orange-100 rounded-lg flex flex-col",
            LOWER_PANEL_MIN_H,
          )}
        >
          <CardHeader className="shrink-0 pb-2">
            <CardTitle className="text-lg font-semibold">Eventos do projeto</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-y-auto pt-0">
            {!events || events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-sm">
                Nenhum evento agendado para este projeto
              </p>
            ) : (
              <div className="space-y-3 pr-1">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center justify-between p-3 border border-base-300 rounded-lg gap-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CalendarIcon className="h-5 w-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.startTime).toLocaleDateString("pt-BR")} —{" "}
                          {new Date(event.startTime).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs shrink-0 text-muted-foreground">
                      {event.attendees?.length || 0} participantes
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

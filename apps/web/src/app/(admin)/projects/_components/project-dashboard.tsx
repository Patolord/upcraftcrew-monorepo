"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { CalendarIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import React from "react";
import type { Project } from "@/types/project";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Progress } from "@/components/ui/progress";

interface ProjectDashboardProps {
  project: Project & { _id: Id<"projects"> };
}

export function ProjectDashboard({ project }: ProjectDashboardProps) {
  // Fetch transactions related to this project
  const transactions = useQuery(api.finance.getTransactionsByProject, {
    projectId: project._id,
  });

  // Fetch events related to this project
  const events = useQuery(api.schedule.getEventsByProject, {
    projectId: project._id,
  });

  // Calculate financial data
  const financialData = useMemo(() => {
    if (!transactions) return { income: 0, expenses: 0, balance: 0 };

    const completed = transactions.filter((t) => t.status === "completed");
    const income = completed
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = completed
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  // Calculate budget usage
  const budgetUsage = useMemo(() => {
    const budget = project.budget || 0;
    const expenses = financialData.expenses;
    const percentage = budget > 0 ? (expenses / budget) * 100 : 0;
    const remaining = budget - expenses;
    const isOverBudget = expenses > budget;

    return {
      percentage,
      remaining,
      isOverBudget,
    };
  }, [project, financialData]);

  // Calculate timeline
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
    const percentage = Math.min((elapsed / total) * 100, 100);
    const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    const isOverdue = now > end;

    return {
      percentage,
      daysRemaining,
      isOverdue,
    };
  }, [project]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card size="sm" className="border border-orange-100 rounded-lg">
          <CardHeader>
            <CardTitle>Progresso</CardTitle>
            <CardDescription className="text-2xl font-bold">{project.progress}%</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {project.status === "completed" ? "Completo" : "Em andamento"}
            </p>
          </CardContent>
        </Card>

        <Card size="sm" className="border border-orange-100 rounded-lg">
          <CardHeader>
            <CardTitle>Orçamento Usado</CardTitle>
            <CardDescription
              className={`text-2xl font-bold ${budgetUsage.isOverBudget ? "text-error" : ""}`}
            >
              {budgetUsage.percentage.toFixed(0)}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{budgetUsage.remaining} restante</p>
          </CardContent>
        </Card>

        <Card size="sm" className="border border-orange-100 rounded-lg">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription
              className={`text-xl font-bold ${timeline.isOverdue ? "text-error" : ""}`}
            >
              {timeline.isOverdue ? "Atrasado" : `${timeline.daysRemaining}d`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{timeline.percentage.toFixed(0)}% do tempo</p>
          </CardContent>
        </Card>

        <Card size="sm" className="border border-orange-100 rounded-lg">
          <CardHeader>
            <CardTitle>Equipe</CardTitle>
            <CardDescription className="text-2xl font-bold">
              {project.team?.length || 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Membros ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <Card className="border border-orange-100 rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg">Progresso do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Conclusão</span>
                  <span className="text-sm font-bold">{project.progress}%</span>
                </div>
                <Progress
                  className="w-full h-4 [&>div]:bg-orange-100"
                  value={project.progress}
                  max={100}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Linha do Tempo</span>
                  <span className="text-sm font-bold">{timeline.percentage.toFixed(0)}%</span>
                </div>
                <Progress
                  className={`w-full h-4 [&>div]:bg-orange-100 ${timeline.isOverdue ? "text-red-500" : "text-blue-500"}`}
                  value={timeline.percentage}
                  max={100}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Status */}
        <Card className="border border-orange-100 rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg">Status do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/60">Total</span>
                <span className="text-sm font-bold">{project.budget?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/60">Gasto</span>
                <span className="text-sm font-bold text-error">
                  {financialData.expenses.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/60">Restante</span>
                <span className="text-sm font-bold text-success">
                  {budgetUsage.remaining.toLocaleString()}
                </span>
              </div>
              <Progress
                className={`w-full h-4 [&>div]:bg-orange-100 ${budgetUsage.isOverBudget ? "text-red-500" : "text-green-500"}`}
                value={budgetUsage.percentage}
                max={100}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card className="border border-orange-100 rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-success/10 border border-success rounded-lg">
              <p className="text-xs text-base-content/60 mb-1">Receita</p>
              <p className="text-2xl font-bold text-success">{financialData.income}</p>
              <p className="text-xs text-base-content/60 mt-1">
                {transactions?.filter((t) => t.type === "income" && t.status === "completed")
                  .length || 0}{" "}
                transações
              </p>
            </div>
            <div className="p-4 bg-error/10 border border-error rounded-lg">
              <p className="text-xs text-base-content/60 mb-1">Despesas</p>
              <p className="text-2xl font-bold text-error">{financialData.expenses}</p>
              <p className="text-xs text-base-content/60 mt-1">
                {transactions?.filter((t) => t.type === "expense" && t.status === "completed")
                  .length || 0}{" "}
                transações
              </p>
            </div>
            <div
              className={`p-4 border rounded-lg ${financialData.balance >= 0 ? "bg-primary/10 border-primary" : "bg-warning/10 border-warning"}`}
            >
              <p className="text-xs text-base-content/60 mb-1">Balanço</p>
              <p
                className={`text-2xl font-bold ${financialData.balance >= 0 ? "text-primary" : "text-warning"}`}
              >
                {Math.abs(financialData.balance)}
              </p>
              <p className="text-xs text-base-content/60 mt-1">
                {financialData.balance >= 0 ? "Lucro" : "Déficit"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Summary */}
      <Card className="border border-orange-100 rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg">Eventos do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          {!events || events.length === 0 ? (
            <p className="text-base-content/60 text-center py-8">
              Nenhum evento agendado para este projeto
            </p>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event._id}
                  className="flex items-center justify-between p-3 border border-base-300 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-base-content/60">
                        {new Date(event.startTime).toLocaleDateString("pt-BR")} -{" "}
                        {new Date(event.startTime).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-sm">
                    {event.attendees?.length || 0} participantes
                  </span>
                </div>
              ))}
              {events.length > 5 && (
                <p className="text-center text-sm text-base-content/60">
                  +{events.length - 5} eventos adicionais
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

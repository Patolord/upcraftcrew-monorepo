"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { CalendarIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProjectDashboardProps {
  project: any;
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

  const isLoading = transactions === undefined || events === undefined;

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
    const percentage = (project.budget / project.budget) * 100;
    const remaining = project.budget.remaining;
    const isOverBudget = percentage > 100;

    return {
      percentage,
      remaining,
      isOverBudget,
    };
  }, [project]);

  // Calculate timeline
  const timeline = useMemo(() => {
    const now = Date.now();
    const start = project.startDate;
    const end = project.endDate;
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
        <div className="stats shadow border border-base-300">
          <div className="stat">
            <div className="stat-title text-xs">Progresso</div>
            <div className="stat-value text-2xl">{project.progress}%</div>
            <div className="stat-desc">
              {project.status === "completed" ? "Completo" : "Em andamento"}
            </div>
          </div>
        </div>

        <div className="stats shadow border border-base-300">
          <div className="stat">
            <div className="stat-title text-xs">Orçamento Usado</div>
            <div className={`stat-value text-2xl ${budgetUsage.isOverBudget ? "text-error" : ""}`}>
              {budgetUsage.percentage.toFixed(0)}%
            </div>
            <div className="stat-desc">{budgetUsage.remaining} restante</div>
          </div>
        </div>

        <div className="stats shadow border border-base-300">
          <div className="stat">
            <div className="stat-title text-xs">Timeline</div>
            <div className={`stat-value text-2xl ${timeline.isOverdue ? "text-error" : ""}`}>
              {timeline.isOverdue ? "Atrasado" : `${timeline.daysRemaining}d`}
            </div>
            <div className="stat-desc">{timeline.percentage.toFixed(0)}% do tempo</div>
          </div>
        </div>

        <div className="stats shadow border border-base-300">
          <div className="stat">
            <div className="stat-title text-xs">Equipe</div>
            <div className="stat-value text-2xl">{project.team.length}</div>
            <div className="stat-desc">Membros ativos</div>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <Card className="border border-base-300">
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
                <progress
                  className="progress progress-primary w-full h-4"
                  value={project.progress}
                  max="100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Linha do Tempo</span>
                  <span className="text-sm font-bold">{timeline.percentage.toFixed(0)}%</span>
                </div>
                <progress
                  className={`progress w-full h-4 ${timeline.isOverdue ? "progress-error" : "progress-info"}`}
                  value={timeline.percentage}
                  max="100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Status */}
        <Card className="border border-base-300">
          <CardHeader>
            <CardTitle className="text-lg">Status do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/60">Total</span>
                <span className="text-sm font-bold">{project.budget.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/60">Gasto</span>
                <span className="text-sm font-bold text-error">{project.budget}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/60">Restante</span>
                <span className="text-sm font-bold text-success">{project.budget.remaining}</span>
              </div>
              <progress
                className={`progress w-full h-4 ${budgetUsage.isOverBudget ? "progress-error" : "progress-success"}`}
                value={budgetUsage.percentage}
                max="100"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card className="border border-base-300">
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
      <Card className="border border-base-300">
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

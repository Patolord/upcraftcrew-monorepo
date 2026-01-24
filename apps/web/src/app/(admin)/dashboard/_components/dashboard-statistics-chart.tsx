"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3Icon, MoreVerticalIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from "react";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Transaction {
  _id: Id<"transactions">;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  status: "pending" | "completed" | "failed";
  date: number;
  projectId?: Id<"projects">;
}

interface StatisticsChartProps {
  transactions: Transaction[];
}

type TimeFilter = "daily" | "weekly" | "monthly" | "yearly";

export function DashboardStatisticsChart({ transactions }: StatisticsChartProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("monthly");

  // Filter only completed transactions
  const completedTransactions = useMemo(
    () => transactions.filter((t) => t.status === "completed"),
    [transactions],
  );

  // Aggregate transactions based on time filter
  const chartData = useMemo(() => {
    if (completedTransactions.length === 0) return [];

    const now = new Date();

    switch (timeFilter) {
      case "daily": {
        // Last 14 days
        const days: Record<string, { income: number; expense: number }> = {};
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 13);

        for (let i = 0; i < 14; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const key = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          days[key] = { income: 0, expense: 0 };
        }

        completedTransactions.forEach((t) => {
          const date = new Date(t.date);
          const key = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          if (days[key]) {
            if (t.type === "income") {
              days[key].income += t.amount;
            } else {
              days[key].expense += t.amount;
            }
          }
        });

        return Object.entries(days).map(([label, data]) => ({
          label,
          ...data,
        }));
      }

      case "weekly": {
        // Last 8 weeks
        const weeks: Record<string, { income: number; expense: number }> = {};
        for (let i = 7; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(weekStart.getDate() - i * 7);
          const key = `Sem ${8 - i}`;
          weeks[key] = { income: 0, expense: 0 };
        }

        completedTransactions.forEach((t) => {
          const date = new Date(t.date);
          const weeksAgo = Math.floor((now.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000));
          if (weeksAgo >= 0 && weeksAgo < 8) {
            const key = `Sem ${8 - weeksAgo}`;
            if (weeks[key]) {
              if (t.type === "income") {
                weeks[key].income += t.amount;
              } else {
                weeks[key].expense += t.amount;
              }
            }
          }
        });

        return Object.entries(weeks).map(([label, data]) => ({
          label,
          ...data,
        }));
      }

      case "monthly": {
        // Group by month (current year)
        const months: Record<string, { income: number; expense: number; order: number }> = {};

        completedTransactions.forEach((t) => {
          const date = new Date(t.date);
          const monthKey = date.toLocaleString("en-US", { month: "short" });
          const monthIndex = date.getMonth();

          if (!months[monthKey]) {
            months[monthKey] = { income: 0, expense: 0, order: monthIndex };
          }

          if (t.type === "income") {
            months[monthKey].income += t.amount;
          } else {
            months[monthKey].expense += t.amount;
          }
        });

        return Object.entries(months)
          .sort((a, b) => a[1].order - b[1].order)
          .map(([label, data]) => ({
            label,
            income: data.income,
            expense: data.expense,
          }));
      }

      case "yearly": {
        // Group by year (last 5 years)
        const years: Record<string, { income: number; expense: number }> = {};
        const currentYear = now.getFullYear();

        for (let i = 4; i >= 0; i--) {
          years[String(currentYear - i)] = { income: 0, expense: 0 };
        }

        completedTransactions.forEach((t) => {
          const year = new Date(t.date).getFullYear().toString();
          if (years[year]) {
            if (t.type === "income") {
              years[year].income += t.amount;
            } else {
              years[year].expense += t.amount;
            }
          }
        });

        return Object.entries(years).map(([label, data]) => ({
          label,
          ...data,
        }));
      }

      default:
        return [];
    }
  }, [completedTransactions, timeFilter]);

  const filterLabels: Record<TimeFilter, string> = {
    daily: "Diário",
    weekly: "Semanal",
    monthly: "Mensal",
    yearly: "Anual",
  };

  // Empty state
  if (chartData.length === 0) {
    return (
      <Card className="rounded-xl bg-white shadow-sm ring-0">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
            <BarChart3Icon className="size-12 mb-3 opacity-50" />
            <p className="text-sm">Nenhuma transação encontrada</p>
            <p className="text-xs mt-1">Adicione transações para ver as estatísticas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl bg-white shadow-sm ring-0">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Estatísticas</CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="sm" className="h-8 px-2 rounded-lg" />}
            >
              <span className="text-sm text-muted-foreground">{filterLabels[timeFilter]}</span>
              <MoreVerticalIcon className="size-4 ml-1 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg">
              <DropdownMenuItem onSelect={() => setTimeFilter("daily")}>Diário</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setTimeFilter("weekly")}>Semanal</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setTimeFilter("monthly")}>Mensal</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setTimeFilter("yearly")}>Anual</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
                }
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `R$ ${value.toLocaleString("pt-BR")}`,
                  name === "income" ? "Receita" : "Despesa",
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                name="Receita"
              />
              <Bar
                dataKey="expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                name="Despesa"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

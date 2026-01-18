"use client";

import { ChevronDownIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import React, { useMemo, useState } from "react";
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

interface DashboardGrowthProps {
  transactions: Transaction[];
}

const CHART_COLORS = {
  profit: "#22c55e", // green
  expenses: "#FF8E29", // orange
};

export function DashboardGrowth({ transactions }: DashboardGrowthProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Calculate profit vs expenses for selected year
  const chartData = useMemo(() => {
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionYear = new Date(transaction.date).getFullYear();
      return transactionYear === selectedYear && transaction.status === "completed";
    });

    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = totalIncome - totalExpenses;

    // Only show data if there are transactions
    if (totalIncome === 0 && totalExpenses === 0) {
      return [];
    }

    return [
      {
        name: "Lucro",
        value: profit > 0 ? profit : 0,
        color: CHART_COLORS.profit,
        displayValue: profit,
      },
      {
        name: "Despesas",
        value: totalExpenses,
        color: CHART_COLORS.expenses,
        displayValue: totalExpenses,
      },
    ].filter((item) => item.value > 0);
  }, [transactions, selectedYear]);

  const totalRevenue = chartData.reduce((sum, item) => sum + item.value, 0);

  // Generate available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set(
      transactions.map((transaction) => new Date(transaction.date).getFullYear()),
    );
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  return (
    <Card className="rounded-xl bg-white shadow-sm ring-0">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Lucro vs Despesas</CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg" />}
            >
              <span className="text-sm text-orange-500">{selectedYear}</span>
              <ChevronDownIcon className="size-4 ml-1 text-orange-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg">
              {availableYears.length > 0 ? (
                availableYears.map((year) => (
                  <DropdownMenuItem key={year} onSelect={() => setSelectedYear(year)}>
                    {year}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>Nenhum ano disponível</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        {totalRevenue > 0 ? (
          <div className="space-y-4">
            <div className="w-full h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    ${Math.abs(item.displayValue).toLocaleString()} (
                    {Math.round((item.value / totalRevenue) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-sm">Nenhuma transação em {selectedYear}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

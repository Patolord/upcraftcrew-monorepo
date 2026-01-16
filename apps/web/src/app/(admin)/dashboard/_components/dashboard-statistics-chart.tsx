"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { MoreVerticalIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from "react";

interface StatisticsChartProps {
  transactions: Array<{
    date: number;
    amount: number;
    type: "income" | "expense";
  }>;
}

export function DashboardStatisticsChart({ transactions }: StatisticsChartProps) {
  // Aggregate transactions by month
  const monthlyData = transactions.reduce(
    (acc, t) => {
      const date = new Date(t.date);
      const monthKey = date.toLocaleString("en-US", { month: "short" });
      const existingMonth = acc.find((m) => m.month === monthKey);

      if (existingMonth) {
        if (t.type === "income") {
          existingMonth.income += t.amount;
        } else {
          existingMonth.expense += t.amount;
        }
      } else {
        acc.push({
          month: monthKey,
          income: t.type === "income" ? t.amount : 0,
          expense: t.type === "expense" ? t.amount : 0,
        });
      }
      return acc;
    },
    [] as Array<{ month: string; income: number; expense: number }>,
  );

  // Default data if no transactions
  const chartData =
    monthlyData.length > 0
      ? monthlyData
      : [
          { month: "Jan", income: 4200, expense: 0 },
          { month: "Feb", income: 3800, expense: 0 },
          { month: "Mar", income: 5100, expense: 0 },
          { month: "Apr", income: 4600, expense: 0 },
          { month: "May", income: 5800, expense: 0 },
          { month: "Jun", income: 4900, expense: 0 },
          { month: "Jul", income: 3200, expense: 0 },
          { month: "Aug", income: 4400, expense: 0 },
        ];

  return (
    <Card className="rounded-xl bg-white shadow-sm ring-0">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Estatisticas</CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="sm" className="h-8 px-2 rounded-lg" />}
            >
              <span className="text-sm text-muted-foreground">Monthly</span>
              <MoreVerticalIcon className="size-4 ml-1 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg">
              <DropdownMenuItem>Daily</DropdownMenuItem>
              <DropdownMenuItem>Weekly</DropdownMenuItem>
              <DropdownMenuItem>Monthly</DropdownMenuItem>
              <DropdownMenuItem>Yearly</DropdownMenuItem>
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
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="income" fill="#FF8E29" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

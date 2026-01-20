"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3Icon } from "lucide-react";
import React from "react";

interface MonthlyData {
  month: string;
  value: number;
  isHighlighted?: boolean;
}

interface FinanceSpentCardProps {
  totalSpent?: number;
  monthlyData?: MonthlyData[];
  budgetLimit?: number;
}

// Dados mockados para demonstração
const mockMonthlyData: MonthlyData[] = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 100 },
  { month: "Mar", value: 140 },
  { month: "Apr", value: 90 },
  { month: "May", value: 110 },
  { month: "Jun", value: 180, isHighlighted: true },
  { month: "Jul", value: 60 },
  { month: "Aug", value: 85 },
  { month: "Sep", value: 95 },
  { month: "Oct", value: 75 },
  { month: "Nov", value: 100 },
  { month: "Dec", value: 110 },
];

export function FinanceSpentCard({
  totalSpent = 682.5,
  monthlyData = mockMonthlyData,
  budgetLimit = 179,
}: FinanceSpentCardProps) {
  const displaySpent = totalSpent ?? 0;

  // Calcula a altura máxima para normalização
  const maxValue = Math.max(...monthlyData.map((d) => d.value));

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white h-full">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Spent</p>
            <span className="text-3xl font-bold text-gray-900">
              ${displaySpent.toLocaleString()}
            </span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <BarChart3Icon className="size-5 text-indigo-600" />
          </button>
        </div>

        {/* Chart */}
        <div className="relative mt-6">
          {/* Budget limit line */}
          <div className="absolute top-0 left-0 right-0 flex items-center z-10">
            <div className="flex-1 border-t-2 border-dashed border-rose-300" />
            <span className="text-xs text-rose-500 font-medium ml-2">${budgetLimit}</span>
          </div>

          {/* Bars */}
          <div className="flex items-end justify-between gap-2 pt-6 h-40">
            {monthlyData.map((data) => {
              const heightPercent = (data.value / maxValue) * 100;
              return (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full max-w-[24px] rounded-t-md transition-all ${
                      data.isHighlighted ? "bg-indigo-600" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    style={{ height: `${heightPercent}%`, minHeight: "8px" }}
                  />
                  <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

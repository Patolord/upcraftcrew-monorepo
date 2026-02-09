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
  averageMonthly?: number;
}

// Dados padrão (vazio) quando não há transações
const emptyMonthlyData: MonthlyData[] = [
  { month: "Jan", value: 0 },
  { month: "Fev", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Abr", value: 0 },
  { month: "Mai", value: 0 },
  { month: "Jun", value: 0 },
  { month: "Jul", value: 0 },
  { month: "Ago", value: 0 },
  { month: "Set", value: 0 },
  { month: "Out", value: 0 },
  { month: "Nov", value: 0 },
  { month: "Dez", value: 0 },
];

export function FinanceSpentCard({
  totalSpent = 0,
  monthlyData = emptyMonthlyData,
  averageMonthly = 0,
}: FinanceSpentCardProps) {
  const displaySpent = totalSpent ?? 0;
  const displayAverage = averageMonthly ?? 0;

  // Calcula a altura máxima para normalização (mínimo 1 para evitar divisão por zero)
  const maxValue = Math.max(...monthlyData.map((d) => d.value), 1);

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white h-full">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total de Gastos</p>
            <span className="text-3xl font-bold text-gray-900">
              R${displaySpent.toLocaleString()}
            </span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <BarChart3Icon className="size-5 text-indigo-600" />
          </button>
        </div>

        {/* Chart */}
        <div className="relative mt-6">
          {/* Average line */}
          {displayAverage > 0 && (
            <div className="absolute top-0 left-0 right-0 flex items-center z-10">
              <div className="flex-1 border-t-2 border-dashed border-amber-400" />
              <span className="text-xs text-amber-600 font-medium ml-2">
                Média: R${displayAverage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          )}

          {/* Bars */}
          <div className="flex items-end justify-between gap-2 pt-6 h-40">
            {monthlyData.map((data) => {
              const heightPercent = maxValue > 0 ? (data.value / maxValue) * 100 : 0;
              return (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full max-w-[24px] rounded-t-md transition-all ${
                      data.isHighlighted ? "bg-indigo-600" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    style={{
                      height: `${heightPercent}%`,
                      minHeight: data.value > 0 ? "8px" : "2px",
                    }}
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

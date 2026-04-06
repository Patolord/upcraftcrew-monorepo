"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2Icon } from "lucide-react";
import type { CurrencyCode } from "@/components/ui/currency-switch";
import React from "react";

interface FinanceBalanceCardProps {
  totalIncome?: number;
  netProfit?: number;
  currency?: CurrencyCode;
}

// Gráfico de linha SVG estilo lilás
const BalanceChart = () => (
  <svg
    viewBox="0 0 400 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-32"
    preserveAspectRatio="none"
  >
    {/* Área preenchida */}
    <defs>
      <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    <path
      d="M0 80 Q 30 75, 50 70 T 100 65 Q 130 60, 160 55 T 220 50 Q 260 45, 300 40 T 360 30 Q 380 25, 400 20 L 400 100 L 0 100 Z"
      fill="url(#balanceGradient)"
    />
    {/* Linha */}
    <path
      d="M0 80 Q 30 75, 50 70 T 100 65 Q 130 60, 160 55 T 220 50 Q 260 45, 300 40 T 360 30 Q 380 25, 400 20"
      stroke="var(--brand)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export function FinanceBalanceCard({
  totalIncome = 0,
  netProfit = 0,
  currency = "BRL",
}: FinanceBalanceCardProps) {
  const income = totalIncome ?? 0;
  const profit = netProfit ?? 0;
  const currencySymbol = currency === "BRL" ? "R$" : "$";

  const savingsPercentage = income > 0 ? ((profit / income) * 100).toFixed(2) : "0.00";

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden h-[290px]">
      <CardContent className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-gray-900">Balanço</h3>
            <Badge
              className={`${profit >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"} border-0 gap-1 px-2 py-1`}
            >
              <CheckCircle2Icon className="size-3.5" />
              {profit >= 0 ? "Positivo" : "Negativo"}
            </Badge>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3">
          {/* Saves */}
          <div className="flex-1 bg-gray-50 rounded-xl p-2">
            <p className="text-sm text-emerald-600 font-medium mb-1">Margem</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{savingsPercentage}%</span>
            </div>
          </div>

          {/* Balance */}
          <div className="flex-1 bg-gray-50 rounded-xl p-2">
            <p className="text-sm text-violet-600 font-medium">Lucro</p>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold ${profit >= 0 ? "text-gray-900" : "text-rose-600"}`}
              >
                {currencySymbol}
                {profit.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-auto">
          <BalanceChart />
        </div>
      </CardContent>
    </Card>
  );
}

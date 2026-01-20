"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2Icon } from "lucide-react";
import React from "react";

interface FinanceBalanceCardProps {
  totalIncome?: number;
  netProfit?: number;
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
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    <path
      d="M0 80 Q 30 75, 50 70 T 100 65 Q 130 60, 160 55 T 220 50 Q 260 45, 300 40 T 360 30 Q 380 25, 400 20 L 400 100 L 0 100 Z"
      fill="url(#balanceGradient)"
    />
    {/* Linha */}
    <path
      d="M0 80 Q 30 75, 50 70 T 100 65 Q 130 60, 160 55 T 220 50 Q 260 45, 300 40 T 360 30 Q 380 25, 400 20"
      stroke="#8b5cf6"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export function FinanceBalanceCard({ totalIncome = 0, netProfit = 0 }: FinanceBalanceCardProps) {
  // Calcula a porcentagem de economia
  const income = totalIncome ?? 0;
  const profit = netProfit ?? 0;

  const savingsPercentage = income > 0 ? ((profit / income) * 100).toFixed(2) : "0.00";

  const savingsChange = 2.45; // Mock
  const balanceChange = -4.75; // Mock

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
      <CardContent>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-gray-900">Balance</h3>
            <Badge className="bg-emerald-50 text-emerald-600 border-0 gap-1 px-2 py-1">
              <CheckCircle2Icon className="size-3.5" />
              On track
            </Badge>
          </div>
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[120px] border-gray-200 text-gray-600">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 mb-2">
          {/* Saves */}
          <div className="flex-1 bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-emerald-600 font-medium mb-1">Saves</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{savingsPercentage}%</span>
              <Badge className="bg-emerald-100 text-emerald-600 border-0 text-xs">
                +{savingsChange}%
              </Badge>
            </div>
          </div>

          {/* Balance */}
          <div className="flex-1 bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-violet-600 font-medium mb-1">Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">${profit.toLocaleString()}</span>
              <Badge className="bg-rose-100 text-rose-600 border-0 text-xs">{balanceChange}%</Badge>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-2">
          <BalanceChart />
        </div>
      </CardContent>
    </Card>
  );
}

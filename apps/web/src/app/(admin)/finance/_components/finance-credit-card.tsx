"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  MoreHorizontalIcon,
  ReceiptIcon,
  ShoppingCartIcon,
  WrenchIcon,
  MonitorIcon,
  MegaphoneIcon,
  BuildingIcon,
  UsersIcon,
  PackageIcon,
} from "lucide-react";
import type { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import type { CurrencyCode } from "@/components/ui/currency-switch";
import React, { useMemo } from "react";

type Transaction = Doc<"transactions"> & {
  project?: Doc<"projects"> | null;
};

interface FinanceCreditCardProps {
  transactions?: Transaction[];
  currency?: CurrencyCode;
}

// Mini gráfico decorativo SVG
const MiniWaveChart = () => (
  <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-10">
    <path
      d="M0 30 Q 10 20, 20 25 T 40 20 Q 50 15, 60 22 T 80 15"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// Mapeamento de categorias para ícones e cores
const categoryConfig: Record<string, { icon: React.ReactNode; bgColor: string }> = {
  "project-payment": {
    icon: <ReceiptIcon className="size-4 text-indigo-600" />,
    bgColor: "bg-indigo-100",
  },
  salary: {
    icon: <UsersIcon className="size-4 text-blue-600" />,
    bgColor: "bg-blue-100",
  },
  subscription: {
    icon: <MonitorIcon className="size-4 text-purple-600" />,
    bgColor: "bg-purple-100",
  },
  equipment: {
    icon: <WrenchIcon className="size-4 text-amber-600" />,
    bgColor: "bg-amber-100",
  },
  marketing: {
    icon: <MegaphoneIcon className="size-4 text-pink-600" />,
    bgColor: "bg-pink-100",
  },
  office: {
    icon: <BuildingIcon className="size-4 text-teal-600" />,
    bgColor: "bg-teal-100",
  },
  software: {
    icon: <MonitorIcon className="size-4 text-cyan-600" />,
    bgColor: "bg-cyan-100",
  },
  consultant: {
    icon: <UsersIcon className="size-4 text-emerald-600" />,
    bgColor: "bg-emerald-100",
  },
  materials: {
    icon: <PackageIcon className="size-4 text-orange-600" />,
    bgColor: "bg-orange-100",
  },
  other: {
    icon: <ShoppingCartIcon className="size-4 text-gray-600" />,
    bgColor: "bg-gray-100",
  },
};

// Função para formatar a data
function formatTransactionDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return `Hoje, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }

  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FinanceCreditCard({ transactions = [], currency = "BRL" }: FinanceCreditCardProps) {
  const currencySymbol = currency === "BRL" ? "R$" : "$";
  // Filtrar apenas transações de despesa (expense) e calcular o total
  const { totalExpenses, recentExpenses } = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");

    const total = expenses
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    // Pegar as 3 transações mais recentes
    const recent = expenses.slice(0, 3);

    return { totalExpenses: total, recentExpenses: recent };
  }, [transactions]);

  const displayBalance = totalExpenses;

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex flex-col flex-1">
        {/* Credit Balance Section */}
        <div className="bg-linear-to-br from-brand via-brand/60 to-brand/30 p-5 rounded-xl mx-4 mt-4 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-sm font-medium">Pagamentos</p>
              <button className="text-white/80 hover:text-white transition-colors">
                <MoreHorizontalIcon className="size-5" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white">
                {currencySymbol}
                {displayBalance.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <MiniWaveChart />
            </div>
          </div>
        </div>

        {/* Recent Section */}
        <div className="p-4 pt-5 flex-1 flex flex-col">
          <p className="text-sm text-gray-500 font-medium mb-4">Recente</p>
          <div className="space-y-4 flex-1">
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4 flex-1 flex items-center justify-center">
                Nenhuma despesa registrada
              </p>
            ) : (
              recentExpenses.map((expense) => {
                const config = categoryConfig[expense.category] || categoryConfig.other;
                return (
                  <div key={expense._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${config.bgColor}`}>{config.icon}</div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{expense.description}</p>
                        <p className="text-xs text-gray-500">
                          {formatTransactionDate(expense.date)}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      -{currencySymbol}
                      {Math.abs(expense.amount).toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

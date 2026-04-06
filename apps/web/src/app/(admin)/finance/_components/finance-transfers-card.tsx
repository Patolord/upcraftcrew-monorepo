"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRightIcon, WalletIcon } from "lucide-react";
import type { CurrencyCode } from "@/components/ui/currency-switch";
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
  clientId?: string;
  projectId?: Id<"projects">;
}

interface FinanceTransfersCardProps {
  transactions: Transaction[];
  onViewAll?: () => void;
  currency?: CurrencyCode;
}

function formatTransactionDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  if (isToday) return `Hoje, ${time}`;
  if (isYesterday) return `Ontem, ${time}`;

  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) + `, ${time}`;
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    salary: "💰",
    freelance: "💻",
    investment: "📈",
    food: "🍔",
    transport: "🚗",
    utilities: "💡",
    entertainment: "🎬",
    shopping: "🛒",
    health: "🏥",
    other: "📦",
  };
  return icons[category] || "📦";
}

export function FinanceTransfersCard({
  transactions,
  onViewAll,
  currency = "BRL",
}: FinanceTransfersCardProps) {
  const currencySymbol = currency === "BRL" ? "R$" : "$";
  // Get the most recent transactions (limit to 3)
  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => b.date - a.date).slice(0, 3);
  }, [transactions]);

  // Empty state
  if (recentTransactions.length === 0) {
    return (
      <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white h-[290px] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Suas Transações</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <WalletIcon className="size-10 mb-3 opacity-50" />
            <p className="text-sm">Nenhuma transação</p>
            <p className="text-xs mt-1">As transações aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white h-[290px] flex flex-col">
      <CardContent className="flex-1 flex flex-col">
        {/* Header */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Suas Transações</h3>

        {/* Transfers List */}
        <div className="space-y-4 flex-1">
          {recentTransactions.map((transaction) => (
            <div key={transaction._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-violet-100 text-violet-600 font-medium text-lg">
                    {getCategoryIcon(transaction.category)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900 line-clamp-1">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">{formatTransactionDate(transaction.date)}</p>
                </div>
              </div>
              <span
                className={`font-semibold text-base whitespace-nowrap ${
                  transaction.type === "income" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {currencySymbol}{" "}
                {transaction.amount.toLocaleString(currency === "BRL" ? "pt-BR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center justify-end gap-2 mt-auto pt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
        >
          Ver todas
          <ArrowRightIcon className="size-4" />
        </button>
      </CardContent>
    </Card>
  );
}

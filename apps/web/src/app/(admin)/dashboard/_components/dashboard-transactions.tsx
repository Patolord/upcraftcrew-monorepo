"use client";

import {
  MoreVerticalIcon,
  WalletIcon,
  CreditCardIcon,
  ArrowLeftRightIcon,
  CircleDollarSignIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import React from "react";

interface Transaction {
  _id: Id<"transactions">;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  status: "pending" | "completed" | "failed";
  date: number;
}

interface DashboardTransactionsProps {
  transactions: Transaction[];
  currency?: string;
}

const categoryIcons: Record<
  string,
  { icon: typeof WalletIcon; bgColor: string; iconColor: string }
> = {
  wallet: { icon: WalletIcon, bgColor: "bg-purple-100", iconColor: "text-purple-600" },
  card: { icon: CreditCardIcon, bgColor: "bg-red-100", iconColor: "text-red-500" },
  transfer: { icon: ArrowLeftRightIcon, bgColor: "bg-green-100", iconColor: "text-green-600" },
  paypal: { icon: CircleDollarSignIcon, bgColor: "bg-blue-100", iconColor: "text-blue-500" },
  default: { icon: WalletIcon, bgColor: "bg-gray-100", iconColor: "text-gray-600" },
};

function getCategoryIcon(category: string) {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes("wallet")) return categoryIcons.wallet;
  if (lowerCategory.includes("card") || lowerCategory.includes("credit")) return categoryIcons.card;
  if (lowerCategory.includes("transfer")) return categoryIcons.transfer;
  if (lowerCategory.includes("paypal")) return categoryIcons.paypal;
  return categoryIcons.default;
}

export function DashboardTransactions({
  transactions,
  currency = "BRL",
}: DashboardTransactionsProps) {
  const currencySymbol = currency === "BRL" ? "R$" : "$";
  const recentTransactions = transactions
    .filter((t) => t.status === "completed")
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

  return (
    <Card className="rounded-xl bg-white shadow-sm ring-0 h-full">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Transações</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
            <MoreVerticalIcon className="size-4 text-muted-foreground" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => {
            const { icon: Icon, bgColor, iconColor } = getCategoryIcon(transaction.category);
            const isIncome = transaction.type === "income";

            return (
              <div key={transaction._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${bgColor} p-2.5 rounded-xl`}>
                    <Icon className={`size-5 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{transaction.category}</p>
                    <p className="text-xs text-muted-foreground">{transaction.description}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${isIncome ? "text-green-500" : "text-red-500"}`}
                >
                  {isIncome ? "+" : "-"}
                  {currencySymbol}
                  {Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center">
            <WalletIcon className="size-10 mx-auto text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground mt-2">Não há transações recentes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

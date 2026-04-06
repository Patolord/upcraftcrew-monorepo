"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/types/finance";
import { cn } from "@/lib/utils";
import { ReceiptIcon } from "lucide-react";
import React from "react";

interface FinanceTransactionsProps {
  transactions: Transaction[];
}

export function FinanceTransactions({ transactions }: FinanceTransactionsProps) {
  const getCompanyInitial = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  const getCompanyColor = (type: string) => {
    switch (type) {
      case "income":
        return "bg-emerald-500";
      case "expense":
        return "bg-rose-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "salary":
      case "project-payment":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "freelance":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "materials":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "tools":
        return "bg-teal-50 text-teal-600 border-teal-200";
      case "office":
      case "consultant":
        return "bg-pink-50 text-pink-600 border-pink-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="space-y-2">
      {transactions.length === 0 ? (
        <Card className="border shadow-sm rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ReceiptIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">Nenhuma transação encontrada</p>
          </CardContent>
        </Card>
      ) : (
        transactions.map((transaction) => {
          const isIncome = transaction.type === "income";
          const initial = getCompanyInitial(transaction.title);
          const colorClass = getCompanyColor(transaction.type);

          return (
            <Card
              key={transaction.id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition-all rounded-xl bg-white"
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Avatar + Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback className={cn("text-white font-semibold", colorClass)}>
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-gray-900 mb-1">
                        {transaction.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-medium border rounded-md px-2 py-0.5",
                            getCategoryColor(transaction.category),
                          )}
                        >
                          {transaction.category}
                        </Badge>
                        {transaction.projectName && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="font-medium text-gray-700">
                              {transaction.projectName}
                            </span>
                          </>
                        )}
                        <span className="text-gray-400">•</span>
                        <span>
                          {new Date(transaction.date).toLocaleDateString("pt-BR", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount + Status */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div
                      className={cn(
                        "font-bold text-xl tabular-nums",
                        isIncome ? "text-green-600" : "text-red-600",
                      )}
                    >
                      {isIncome ? "+" : "-"}R${transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <Badge
                      className={cn(
                        "text-xs font-semibold px-3 py-1 rounded-md",
                        transaction.status === "completed"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200",
                      )}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

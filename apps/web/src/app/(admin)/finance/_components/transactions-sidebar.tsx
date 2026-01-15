"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Transaction } from "@/types/finance";
import { cn } from "@/lib/utils";

interface TransactionsSidebarProps {
  transactions: Transaction[];
}

export function TransactionsSidebar({ transactions }: TransactionsSidebarProps) {
  // Get recent transactions and group by date
  const recentTransactions = transactions.slice(0, 10);

  // Group transactions by Today, Yesterday, etc.
  const groupedTransactions = recentTransactions.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let group = "Earlier";
      if (date.toDateString() === today.toDateString()) {
        group = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        group = "Yesterday";
      }

      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(transaction);
      return groups;
    },
    {} as Record<string, Transaction[]>,
  );

  const getCompanyInitial = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  const getCompanyColor = (type: string) => {
    switch (type) {
      case "income":
        return "bg-blue-500";
      case "expense":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b bg-muted/5 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Transactions</CardTitle>
          <span className="text-sm text-muted-foreground">March 2022</span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([group, groupTransactions]) => (
            <div key={group}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">{group}</h4>
              <div className="space-y-4">
                {groupTransactions.map((transaction) => {
                  const isIncome = transaction.type === "income";
                  const initial = getCompanyInitial(transaction.title);
                  const colorClass = getCompanyColor(transaction.type);

                  return (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={cn("text-white", colorClass)}>
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{transaction.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "font-semibold text-sm",
                          isIncome
                            ? "text-green-600 dark:text-green-500"
                            : "text-red-600 dark:text-red-500",
                        )}
                      >
                        {isIncome ? "+" : "-"}${transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {recentTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No recent transactions</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

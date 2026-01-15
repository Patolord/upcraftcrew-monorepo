"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import type { Transaction } from "@/types/finance";
import { categoryConfig, statusConfig } from "@/app/(admin)/finance/config";
import { CircleIcon, PencilIcon, MoreHorizontalIcon, EyeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function TransactionRow({
  transaction,
  onEdit,
}: {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
}) {
  const category = categoryConfig[transaction.category] || {
    label: transaction.category,
    icon: "CircleIcon",
  };
  const status = statusConfig[transaction.status];
  const isIncome = transaction.type === "income";

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isIncome ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20",
            )}
          >
            <span
              className={cn(
                "iconify size-5",
                isIncome ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500",
              )}
            />
          </div>
          <div>
            <div className="font-medium">{transaction.title}</div>
            {transaction.description && (
              <div className="text-xs text-muted-foreground line-clamp-1">
                {transaction.description}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {category.label}
        </Badge>
      </TableCell>
      <TableCell>
        {transaction.client && <div className="text-sm">{transaction.client}</div>}
        {transaction.projectName && (
          <div className="text-xs text-muted-foreground">{transaction.projectName}</div>
        )}
        {!transaction.client && !transaction.projectName && (
          <span className="text-muted-foreground/40">—</span>
        )}
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {new Date(transaction.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={transaction.status === "completed" ? "success" : "warning"}
          className="text-xs"
        >
          {status?.label || transaction.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div
          className={cn(
            "font-semibold",
            isIncome ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500",
          )}
        >
          {isIncome ? "+" : "-"}${transaction.amount.toFixed(0)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(transaction)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

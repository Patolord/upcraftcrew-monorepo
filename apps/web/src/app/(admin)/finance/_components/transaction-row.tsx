"use client";

import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types/finance";
import { categoryConfig, statusConfig } from "@/app/(admin)/finance/config";
import { CircleIcon, PencilIcon, MoreHorizontalIcon, EyeIcon } from "lucide-react";

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
  const status = statusConfig[transaction.status] || {
    label: transaction.status,
    color: "badge-ghost",
  };
  const isIncome = transaction.type === "income";

  return (
    <tr className="hover">
      <td>
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isIncome ? "bg-success/20" : "bg-error/20"
            }`}
          >
            <span
              className={`iconify ${category.icon} size-5 ${
                isIncome ? "text-success" : "text-error"
              }`}
            />
          </div>
          <div>
            <div className="font-medium">{transaction.title}</div>
            {transaction.description && (
              <div className="text-xs text-base-content/60 line-clamp-1">
                {transaction.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td>
        <span className="badge badge-sm badge-ghost">{category.label}</span>
      </td>
      <td>
        {transaction.client && <div className="text-sm">{transaction.client}</div>}
        {transaction.projectName && (
          <div className="text-xs text-base-content/60">{transaction.projectName}</div>
        )}
        {!transaction.client && !transaction.projectName && (
          <span className="text-base-content/40">—</span>
        )}
      </td>
      <td>
        <div className="text-sm">
          {new Date(transaction.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </td>
      <td>
        <span className={`badge ${status.color} badge-sm`}>{status.label}</span>
      </td>
      <td className="text-right">
        <div className={`font-semibold ${isIncome ? "text-success" : "text-error"}`}>
          {isIncome ? "+" : "-"}
          {transaction.amount.toFixed(0)}
        </div>
      </td>
      <td>
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button className="btn btn-ghost btn-xs" onClick={() => onEdit(transaction)}>
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          <Button className="btn btn-ghost btn-xs">
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button className="btn btn-ghost btn-xs">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

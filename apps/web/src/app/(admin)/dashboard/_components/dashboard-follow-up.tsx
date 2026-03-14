"use client";

import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, AlertCircle, Clock, FileText } from "lucide-react";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Budget {
  _id: Id<"budgets">;
  title: string;
  client: string;
  status: "draft" | "sent" | "approved" | "rejected" | "cancelled" | "expired";
  totalAmount: number;
  currency: string;
  validUntil: number;
  createdAt: number;
}

interface DashboardFollowUpProps {
  budgets: Budget[];
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  draft: {
    label: "Rascunho",
    color: "bg-gray-100 text-gray-700",
    icon: Clock,
  },
  sent: {
    label: "Enviado",
    color: "bg-blue-100 text-blue-700",
    icon: CalendarClock,
  },
  expired: {
    label: "Expirado",
    color: "bg-amber-100 text-amber-700",
    icon: AlertCircle,
  },
};

function getDaysUntil(timestamp: number): number {
  const now = Date.now();
  const diff = timestamp - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getUrgencyColor(daysUntil: number): string {
  if (daysUntil < 0) return "text-red-600";
  if (daysUntil <= 3) return "text-red-500";
  if (daysUntil <= 7) return "text-amber-500";
  return "text-muted-foreground";
}

function getUrgencyText(daysUntil: number): string {
  if (daysUntil < 0) return `${Math.abs(daysUntil)}d atrás`;
  if (daysUntil === 0) return "Hoje";
  if (daysUntil === 1) return "Amanhã";
  return `${daysUntil}d`;
}

export function DashboardFollowUp({ budgets }: DashboardFollowUpProps) {
  const router = useRouter();

  const pendingBudgets = useMemo(() => {
    return budgets
      .filter((b) => b.status === "draft" || b.status === "sent")
      .sort((a, b) => a.validUntil - b.validUntil)
      .slice(0, 4);
  }, [budgets]);

  const handleClick = (budgetId: Id<"budgets">) => {
    router.push(`/budgets/${budgetId}`);
  };

  const displayBudgets = [...pendingBudgets];
  while (displayBudgets.length < 4) {
    displayBudgets.push(null as unknown as Budget);
  }

  return (
    <Card className="rounded-xl bg-white shadow-sm ring-0 h-full">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Follow Up</CardTitle>
        <CardAction>
          <Badge variant="secondary" className="text-xs">
            {pendingBudgets.length} pendente{pendingBudgets.length !== 1 ? "s" : ""}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayBudgets.map((budget, index) => {
            if (!budget) {
              // Empty placeholder slot
              return (
                <div
                  key={`empty-${index}`}
                  className="flex items-start gap-3 p-2 rounded-lg h-[52px]"
                >
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-muted/30" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="h-4 w-24 bg-muted/30 rounded" />
                    <div className="h-3 w-16 bg-muted/20 rounded" />
                  </div>
                </div>
              );
            }

            const daysUntil = getDaysUntil(budget.validUntil);
            const config = statusConfig[budget.status];
            const StatusIcon = config?.icon ?? FileText;

            return (
              <div
                key={budget._id}
                className="flex items-start gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleClick(budget._id)}
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <FileText className="size-4 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{budget.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{budget.client}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
                      config?.color ?? "bg-gray-100 text-gray-700",
                    )}
                  >
                    <StatusIcon className="size-2.5" />
                    {config?.label ?? budget.status}
                  </span>
                  <span className={cn("text-[10px] font-medium", getUrgencyColor(daysUntil))}>
                    {getUrgencyText(daysUntil)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

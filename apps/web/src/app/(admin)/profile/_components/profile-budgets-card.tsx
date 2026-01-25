"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Send, AlertTriangle } from "lucide-react";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Budget {
  _id: Id<"budgets">;
  title: string;
  client: string;
  status: "draft" | "sent" | "approved" | "rejected" | "cancelled" | "expired";
  totalAmount: number;
  currency: string;
  validUntil: number;
  project?: {
    _id: Id<"projects">;
    name: string;
  } | null;
}

interface ProfileBudgetsCardProps {
  budgets: Budget[];
}

const statusConfig = {
  draft: {
    label: "Draft",
    icon: FileText,
    color: "bg-gray-100 text-gray-700",
  },
  sent: {
    label: "Sent",
    icon: Send,
    color: "bg-blue-100 text-blue-700",
  },
  approved: {
    label: "Approved",
    icon: FileText,
    color: "bg-green-100 text-green-700",
  },
  rejected: {
    label: "Rejected",
    icon: FileText,
    color: "bg-red-100 text-red-700",
  },
  expired: {
    label: "Expired",
    icon: AlertTriangle,
    color: "bg-yellow-100 text-yellow-700",
  },
  cancelled: {
    label: "Cancelled",
    icon: AlertTriangle,
    color: "bg-gray-100 text-gray-500",
  },
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProfileBudgetsCard({ budgets }: ProfileBudgetsCardProps) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">My Budgets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {budgets.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No pending budgets in your projects
          </p>
        ) : (
          budgets.slice(0, 3).map((budget) => {
            const statusInfo = statusConfig[budget.status];
            const StatusIcon = statusInfo.icon;

            return (
              <Link
                key={budget._id}
                href={`/budgets/${budget._id}`}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-orange-50/50 transition-colors group"
              >
                <div
                  className={`flex items-center justify-center size-8 rounded-full ${statusInfo.color}`}
                >
                  <StatusIcon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-orange-600 transition-colors">
                    {budget.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{budget.client}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-orange-500">
                    {formatCurrency(budget.totalAmount, budget.currency)}
                  </p>
                  <Badge variant="secondary" className={`text-xs ${statusInfo.color}`}>
                    {statusInfo.label}
                  </Badge>
                </div>
              </Link>
            );
          })
        )}

        {budgets.length > 0 && (
          <Link
            href="/budgets"
            className="block text-center text-sm text-orange-500 hover:text-orange-600 font-medium pt-2"
          >
            View all budgets →
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

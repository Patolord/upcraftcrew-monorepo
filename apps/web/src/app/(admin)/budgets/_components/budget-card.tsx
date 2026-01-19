import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { EyeIcon, CalendarIcon } from "lucide-react";
import React from "react";

const statusConfig = {
  draft: {
    label: "Rascunho",
    variant: "secondary" as const,
  },
  sent: {
    label: "Enviado",
    variant: "default" as const,
  },
  approved: {
    label: "Aprovado",
    variant: "success" as const,
  },
  rejected: {
    label: "Rejeitado",
    variant: "destructive" as const,
  },
  expired: {
    label: "Expirado",
    variant: "outline" as const,
  },
};

interface Budget {
  _id: Id<"budgets">;
  title: string;
  client: string;
  description: string;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
  totalAmount: number;
  currency: string;
  validUntil: number;
  createdAt: number;
}

function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function BudgetCard({ budget }: { budget: Budget }) {
  const status = statusConfig[budget.status];
  const isExpired = budget.validUntil < Date.now() && budget.status === "sent";

  return (
    <Card className="border border-border rounded-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg">{budget.title}</CardTitle>
            <CardDescription className="mt-1">{budget.client}</CardDescription>
          </div>
          <CardAction>
            <Badge variant={isExpired ? "outline" : status.variant}>
              {isExpired ? "Expirado" : status.label}
            </Badge>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{budget.description}</p>

        {/* Value */}
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-1">Valor Total</p>
          <p className="text-2xl font-bold text-orange-500">
            {formatCurrency(budget.totalAmount, budget.currency)}
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Criado em</p>
            <p className="text-sm font-medium flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {new Date(budget.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Válido até</p>
            <p
              className={`text-sm font-medium flex items-center gap-1 ${isExpired ? "text-destructive" : ""}`}
            >
              <CalendarIcon className="h-3 w-3" />
              {new Date(budget.validUntil).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="justify-end">
        <Link href={`/budgets/${budget._id}`}>
          <Button className="bg-orange-500 text-white rounded-md text-xs">
            <EyeIcon className="h-4 w-4 mr-1" />
            Visualizar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

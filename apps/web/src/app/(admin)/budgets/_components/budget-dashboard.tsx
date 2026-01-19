"use client";

import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface BudgetStats {
  total: number;
  draft: number;
  sent: number;
  approved: number;
  rejected: number;
  totalValue: number;
  approvedValue: number;
  conversionRate: number;
}

interface BudgetDashboardProps {
  stats?: BudgetStats;
}

function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function BudgetDashboard({ stats }: BudgetDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <Card className="text-center rounded-lg">
        <CardContent className="pt-3">
          <div className="text-xl text-muted-foreground">Total Orçamentos</div>
          <div className="text-lg font-semibold pt-2">{stats?.total || 0}</div>
        </CardContent>
      </Card>

      <Card className=" text-center rounded-lg">
        <CardContent className="pt-3">
          <div className="text-xl text-muted-foreground">Rascunho</div>
          <div className="text-lg font-semibold pt-2">{stats?.draft || 0}</div>
        </CardContent>
      </Card>

      <Card className=" rounded-lg text-center">
        <CardContent className="pt-3">
          <div className="text-xl text-muted-foreground">Enviados</div>
          <div className="text-lg font-semibold pt-2">{stats?.sent || 0}</div>
        </CardContent>
      </Card>

      <Card className=" rounded-lg text-center">
        <CardContent className="pt-3">
          <div className="text-xl text-muted-foreground">Aprovados</div>
          <div className="text-lg font-semibold pt-2">{stats?.approved || 0}</div>
        </CardContent>
      </Card>

      <Card className=" rounded-lg text-center">
        <CardContent className="pt-3">
          <div className="text-xl text-muted-foreground">Valor Total</div>
          <div className="text-lg font-semibold pt-2">{formatCurrency(stats?.totalValue || 0)}</div>
        </CardContent>
      </Card>

      <Card className=" rounded-lg text-center">
        <CardContent className="pt-3">
          <div className="text-xl text-muted-foreground">Valor Aprovado</div>
          <div className="text-lg font-semibold pt-2">
            {formatCurrency(stats?.approvedValue || 0)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

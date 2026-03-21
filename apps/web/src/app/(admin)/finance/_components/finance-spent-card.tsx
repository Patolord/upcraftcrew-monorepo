"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CalendarClockIcon, TrendingUpIcon, TrendingDownIcon, ArrowRightIcon } from "lucide-react";
import type { CurrencyCode } from "@/components/ui/currency-switch";
import React from "react";

interface FinanceSpentCardProps {
  currency?: CurrencyCode;
  pendingIncome?: number;
  pendingExpenses?: number;
  projectedBalance?: number;
  currentBalance?: number;
}

function formatCurrency(value: number, symbol: string) {
  return `${symbol}${Math.abs(value).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function FinanceSpentCard({
  currency = "BRL",
  pendingIncome = 0,
  pendingExpenses = 0,
  projectedBalance = 0,
  currentBalance = 0,
}: FinanceSpentCardProps) {
  const currencySymbol = currency === "BRL" ? "R$" : "$";
  const hasPending = pendingIncome > 0 || pendingExpenses > 0;

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white h-full flex flex-col">
      <CardContent className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50">
              <CalendarClockIcon className="size-[18px] text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Previsão Financeira</p>
              <p className="text-xs text-gray-400">Entradas e saídas programadas</p>
            </div>
          </div>
        </div>

        {hasPending && (
          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50/60 border border-emerald-100 px-5 py-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 shrink-0">
                <TrendingUpIcon className="size-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-emerald-500 font-medium mb-0.5">Entradas previstas</p>
                <p className="text-lg font-bold text-emerald-700">
                  +{formatCurrency(pendingIncome, currencySymbol)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-red-50/60 border border-red-100 px-5 py-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 shrink-0">
                <TrendingDownIcon className="size-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-red-500 font-medium mb-0.5">Saídas previstas</p>
                <p className="text-lg font-bold text-red-700">
                  -{formatCurrency(pendingExpenses, currencySymbol)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 px-5 py-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 shrink-0">
                <ArrowRightIcon className="size-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Saldo atual</p>
                <p
                  className={`text-lg font-bold ${currentBalance >= 0 ? "text-gray-900" : "text-red-600"}`}
                >
                  {formatCurrency(currentBalance, currencySymbol)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-indigo-50/60 border border-indigo-100 px-5 py-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 shrink-0">
                <ArrowRightIcon className="size-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-indigo-400 font-medium mb-0.5">Saldo previsto</p>
                <p
                  className={`text-lg font-bold ${projectedBalance >= 0 ? "text-indigo-700" : "text-red-600"}`}
                >
                  {projectedBalance >= 0 ? "" : "-"}
                  {formatCurrency(projectedBalance, currencySymbol)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasPending && (
          <div className="flex flex-col items-center justify-center flex-1 py-8 text-center">
            <CalendarClockIcon className="size-8 text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">Nenhuma transação programada</p>
            <p className="text-xs text-gray-300 mt-0.5">Transações pendentes aparecerão aqui</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

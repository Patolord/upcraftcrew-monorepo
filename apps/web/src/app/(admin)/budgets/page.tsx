"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { BudgetDashboard } from "./_components/budget-dashboard";
import { AllBudgets } from "./_components/all-budgets";

export default function BudgetsPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "all">("dashboard");

  const budgets = useQuery(api.budgets.getBudgets);
  const stats = useQuery(api.budgets.getBudgetStats);

  const isLoading = budgets === undefined || stats === undefined;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-base-content/60 text-sm mt-1">
            Gerencie propostas e orçamentos para clientes
          </p>
        </div>
        {activeTab === "all" && (
          <Button className="btn btn-primary gap-2" onClick={() => {}}>
            <span className="iconify lucide--plus size-5" />
            Novo Orçamento
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed w-fit">
        <button
          type="button"
          className={`tab ${activeTab === "dashboard" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <span className="iconify lucide--layout-dashboard size-4 mr-2" />
          Dashboard
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <span className="iconify lucide--file-text size-4 mr-2" />
          Todos os Orçamentos
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <>
          {/* Tab Content */}
          {activeTab === "dashboard" ? (
            <BudgetDashboard budgets={budgets || []} stats={stats} />
          ) : (
            <AllBudgets budgets={budgets || []} />
          )}
        </>
      )}
    </div>
  );
}

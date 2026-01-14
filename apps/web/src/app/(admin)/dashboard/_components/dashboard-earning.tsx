"use client";

import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardEarningProps {
  totalEarning: number;
  growthPercentage: number;
}

export function DashboardEarning({
  totalEarning = 89670,
  growthPercentage = 28.8,
}: DashboardEarningProps) {
  return (
    <Card className="rounded-xl bg-white shadow-sm ring-0 h-full">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Earning</CardTitle>
        <CardAction>
          <div className="bg-orange-500 p-1.5 rounded-md">
            <Check className="size-4 text-white" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-4 space-y-2">
        <span className="text-3xl font-bold text-foreground">${totalEarning.toLocaleString()}</span>
        <span className="text-sm text-green-500 font-medium">+{growthPercentage}%</span>
        <span className="text-xs text-muted-foreground">This month growth</span>
        <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6">
          Withdraw money
        </Button>
      </CardContent>
    </Card>
  );
}

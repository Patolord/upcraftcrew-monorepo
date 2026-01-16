"use client";

import { ChevronDownIcon, PieChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import React from "react";

export function DashboardGrowth() {
  return (
    <Card className="rounded-xl bg-white shadow-sm ring-0 h-full">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Growth</CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg" />}
            >
              <span className="text-sm text-orange-500">2022</span>
              <ChevronDownIcon className="size-4 ml-1 text-orange-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg">
              <DropdownMenuItem>2022</DropdownMenuItem>
              <DropdownMenuItem>2023</DropdownMenuItem>
              <DropdownMenuItem>2024</DropdownMenuItem>
              <DropdownMenuItem>2025</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-4">
        <ChartContainer
          config={{
            growth: {
              color: "#22c55e",
            },
          }}
        >
          <PieChartIcon className="w-full h-full" />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

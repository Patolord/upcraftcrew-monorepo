"use client";

import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  name: string;
  client: string;
  budget: number;
  progress: number;
  status: "planning" | "in-progress" | "completed";
}

interface DashboardRecentProjectsTableProps {
  projects: Project[];
}

// Map some common countries to flag emojis
const countryFlags: Record<string, string> = {
  england: "🇬🇧",
  "united kingdom": "🇬🇧",
  uk: "🇬🇧",
  brazil: "🇧🇷",
  brasil: "🇧🇷",
  "united states": "🇺🇸",
  usa: "🇺🇸",
  us: "🇺🇸",
  africa: "🌍",
  australia: "🇦🇺",
  germany: "🇩🇪",
  france: "🇫🇷",
  spain: "🇪🇸",
  italy: "🇮🇹",
  japan: "🇯🇵",
  china: "🇨🇳",
  canada: "🇨🇦",
  mexico: "🇲🇽",
  default: "🌐",
};

function getCountryFlag(country: string): string {
  const lowerCountry = country.toLowerCase();
  return countryFlags[lowerCountry] || countryFlags.default;
}

export function DashboardRecentProjectsTable({ projects }: DashboardRecentProjectsTableProps) {
  const recentProjects = projects.slice(0, 6);

  // Transform projects to table data format
  const tableData = recentProjects.map((project, index) => ({
    id: project._id,
    country: project.client || "Unknown",
    flag: getCountryFlag(project.client),
    customer: Math.floor(Math.random() * 2000) + 400,
    sale: Math.floor(Math.random() * 3000) + 500,
    value: project.budget,
    bounce: `${(project.progress * 0.4 + 10).toFixed(2)}%`,
  }));

  return (
    <Card className="rounded-xl bg-white shadow-sm ring-0">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Projetos Recentes</CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg" />}
            >
              <span className="text-sm text-orange-500">2022</span>
              <ChevronDown className="size-4 ml-1 text-orange-500" />
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
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Country
                </th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Sale
                </th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Value
                </th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Bounce
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{row.flag}</span>
                        <span className="text-sm text-foreground">{row.country}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-foreground">{row.customer}</td>
                    <td className="py-3 px-2 text-sm text-foreground">{row.sale}</td>
                    <td className="py-3 px-2 text-sm text-foreground">
                      ${row.value.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-foreground">{row.bounce}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import React from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const recentProjects = projects.slice(0, 4);

  // Transform projects to table data format
  const tableData = recentProjects.map((project) => ({
    id: project._id,
    country: project.client || "Unknown",
    flag: getCountryFlag(project.client),
    customer: Math.floor(Math.random() * 2000) + 400,
    sale: Math.floor(Math.random() * 3000) + 500,
    value: project.budget,
    bounce: `${(project.progress * 0.4 + 10).toFixed(2)}%`,
  }));

  const handleRowClick = (projectId: Id<"projects">) => {
    router.push(`/projects/${projectId}`);
  };

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="uppercase tracking-wider">Country</TableHead>
              <TableHead className="uppercase tracking-wider">Customer</TableHead>
              <TableHead className="uppercase tracking-wider">Sale</TableHead>
              <TableHead className="uppercase tracking-wider">Value</TableHead>
              <TableHead className="uppercase tracking-wider">Bounce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRowClick(row.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{row.flag}</span>
                      <span className="text-sm text-foreground">{row.country}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{row.customer}</TableCell>
                  <TableCell className="text-sm text-foreground">{row.sale}</TableCell>
                  <TableCell className="text-sm text-foreground">
                    ${row.value.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{row.bounce}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

import type { Project } from "@/types/project";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProjectsStatsProps {
  projects: Project[];
}

export function ProjectsStats({ projects }: ProjectsStatsProps) {
  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      className: "",
    },
    {
      title: "In Progress",
      value: projects.filter((p) => p.status === "in-progress").length,
      className: "text-primary",
    },
    {
      title: "Completed",
      value: projects.filter((p) => p.status === "completed").length,
      className: "text-success",
    },
    {
      title: "Planning",
      value: projects.filter((p) => p.status === "planning").length,
      className: "text-info",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border border-border rounded-lg">
          <CardHeader className="text-center py-2">
            <CardTitle className="text-xs">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-4">
            <div className={`text-2xl font-bold ${stat.className}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

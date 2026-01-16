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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Project } from "@/types/project";
import { EyeIcon, FlagIcon } from "lucide-react";
import React from "react";

const statusConfig = {
  planning: {
    label: "Planning",
    variant: "secondary" as const,
  },
  "in-progress": {
    label: "In Progress",
    variant: "default" as const,
  },
  completed: {
    label: "Completed",
    variant: "success" as const,
  },
};

const priorityConfig = {
  low: {
    label: "Low",
    color: "text-muted-foreground",
  },
  medium: {
    label: "Medium",
    color: "text-blue-600",
  },
  high: {
    label: "High",
    color: "text-amber-600",
  },
  urgent: {
    label: "Urgent",
    color: "text-red-600",
  },
};

export function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status as keyof typeof statusConfig];
  const priority = priorityConfig[project.priority];

  return (
    <Card className="border border-border rounded-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            {project.client && <CardDescription className="mt-1">{project.client}</CardDescription>}
          </div>
          <CardAction>
            <Badge variant={status.variant}>{status.label}</Badge>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2 bg-secondary [&>div]:bg-orange-500" />
        </div>

        {/* Budget & Team */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {project.budget && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Budget</p>
              <p className="text-sm font-medium">{project.budget.toLocaleString()}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Timeline</p>
            <p className="text-sm font-medium">
              {new Date(project.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              {project.endDate &&
                ` - ${new Date(project.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}`}
            </p>
          </div>
        </div>

        {/* Team Avatars */}
        {project.team && project.team.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-3">
                {project.team.slice(0, 4).map((member) => (
                  <Avatar
                    key={member.imageUrl || member.name}
                    className="w-8 h-8 border-2 border-white ring-1 ring-gray-200"
                  >
                    <AvatarImage src={member.imageUrl || "/default-avatar.png"} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {member.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project.team.length > 4 && (
                  <Avatar className="w-8 h-8 border-2 border-white ring-1 ring-gray-200">
                    <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
                      +{project.team.length - 4}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${priority.color}`}>
                <FlagIcon className="h-3 w-3" />
                {priority.label}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Actions */}
      <CardFooter className="justify-end border-t border-orange-500">
        <Link href={`/projects/${project._id}`}>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 rounded-md text-xs">
            <EyeIcon className="h-4 w-4 mr-1" />
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

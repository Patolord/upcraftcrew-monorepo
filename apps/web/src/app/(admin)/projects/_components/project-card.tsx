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
    label: "Planejamento",
    variant: "secondary" as const,
  },
  "in-progress": {
    label: "Em Progresso",
    variant: "default" as const,
  },
  completed: {
    label: "Concluído",
    variant: "success" as const,
  },
};

const priorityConfig = {
  low: {
    label: "Baixa",
    color: "text-muted-foreground",
  },
  medium: {
    label: "Média",
    color: "text-blue-600",
  },
  high: {
    label: "Alta",
    color: "text-amber-600",
  },
  urgent: {
    label: "Urgente",
    color: "text-red-600",
  },
};

export function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status as keyof typeof statusConfig];
  const priority = priorityConfig[project.priority];

  return (
    <Card className="border border-border rounded-md hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-2 md:gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg truncate">{project.name}</CardTitle>
            {project.client && (
              <CardDescription className="mt-1 text-sm truncate">{project.client}</CardDescription>
            )}
          </div>
          <CardAction>
            <Badge variant={status.variant} className="text-[10px] md:text-xs whitespace-nowrap">
              {status.label}
            </Badge>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 md:p-6 pt-0 md:pt-0">
        {/* Description */}
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        {/* Manager */}
        {project.manager && project.manager.name && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] md:text-xs text-muted-foreground">Manager:</span>
            <div className="flex items-center gap-2">
              <Avatar className="w-5 h-5 md:w-6 md:h-6">
                <AvatarImage src={project.manager.imageUrl} alt={project.manager.name} />
                <AvatarFallback className="text-[10px] md:text-xs">
                  {project.manager.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] md:text-xs font-medium truncate">
                {project.manager.name}
              </span>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mt-3 md:mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] md:text-xs text-muted-foreground">Progresso</span>
            <span className="text-[10px] md:text-xs font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-1.5 md:h-2 [&>div]:bg-base-300" />
        </div>

        {/* Budget & Team */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 mt-3 md:mt-4">
          {project.budget && (
            <div>
              <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Orçamento</p>
              <p className="text-xs md:text-sm font-medium">{project.budget.toLocaleString()}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Cronograma</p>
            <p className="text-xs md:text-sm font-medium">
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
          <div className="mt-3 md:mt-4">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2 md:-space-x-3">
                {project.team.slice(0, 4).map((member, index) => (
                  <Avatar
                    key={member.imageUrl || member.name || index}
                    className="w-6 h-6 md:w-8 md:h-8 border-2 border-white ring-1 ring-gray-200"
                  >
                    <AvatarImage src={member.imageUrl} alt={member.name} />
                    <AvatarFallback className="text-[10px] md:text-xs">
                      {member.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project.team.length > 4 && (
                  <Avatar className="w-6 h-6 md:w-8 md:h-8 border-2 border-white ring-1 ring-gray-200">
                    <AvatarFallback className="text-[10px] md:text-xs bg-gray-100 text-gray-700">
                      +{project.team.length - 4}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <span
                className={`text-[10px] md:text-xs font-medium flex items-center gap-1 ${priority.color}`}
              >
                <FlagIcon className="h-3 w-3" />
                {priority.label}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Actions */}
      <CardFooter className="justify-end mt-auto p-4 md:p-6 pt-0 md:pt-0">
        <Link href={`/projects/${project._id}`}>
          <Button className="bg-orange-500 text-white rounded-md text-[10px] md:text-xs h-7 md:h-8 px-2 md:px-3">
            <EyeIcon className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
            <span className="hidden sm:inline">Visualizar</span>
            <span className="sm:hidden">Ver</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

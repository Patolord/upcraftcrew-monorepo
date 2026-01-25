"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  DollarSignIcon,
  FlagIcon,
  UsersIcon,
  FileTextIcon,
  PaperclipIcon,
} from "lucide-react";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

const statusConfig = {
  planning: {
    label: "Planejamento",
    variant: "secondary" as const,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  "in-progress": {
    label: "Em Progresso",
    variant: "default" as const,
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  completed: {
    label: "Concluído",
    variant: "success" as const,
    color: "bg-green-100 text-green-700 border-green-200",
  },
};

const priorityConfig = {
  low: {
    label: "Baixa",
    color: "text-gray-600",
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

interface ProjectInfoProps {
  project: {
    _id: Id<"projects">;
    name: string;
    client?: string;
    description: string;
    status: "planning" | "in-progress" | "completed";
    priority: "low" | "medium" | "high" | "urgent";
    progress: number;
    budget?: number;
    startDate: number;
    endDate?: number;
    notes?: string;
    files?: Array<{
      name: string;
      url: string;
      size: number;
      uploadedAt: number;
    }>;
    team?: Array<{
      _id?: string;
      firstName: string;
      lastName: string;
      imageUrl?: string;
      email: string;
    }>;
    manager?: {
      _id?: string;
      firstName: string;
      lastName: string;
      imageUrl?: string;
      email: string;
    };
  };
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  const status = statusConfig[project.status];
  const priority = priorityConfig[project.priority];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card */}
        <Card className="border border-orange-100 rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={status.variant} className={`${status.color} border`}>
              {status.label}
            </Badge>
          </CardContent>
        </Card>

        {/* Priority Card */}
        <Card className="border border-orange-100 rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center gap-2 ${priority.color} font-medium`}>
              <FlagIcon className="h-4 w-4" />
              <span>{priority.label}</span>
            </div>
          </CardContent>
        </Card>

        {/* Budget Card */}
        <Card className="border border-orange-100 rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
              <DollarSignIcon className="h-5 w-5 text-green-600" />
              <span>{project.budget?.toLocaleString("en-US") || "N/A"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card className="border border-orange-100 rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-foreground">{project.progress}%</span>
              </div>
              <Progress
                value={project.progress}
                className="h-2 bg-secondary [&>div]:bg-orange-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description */}
        <Card className="lg:col-span-2 rounded-lg border border-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-orange-500" />
              Project Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 ">
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>

            {project.notes && (
              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm text-foreground mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="border border-orange-100 rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-orange-500" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Start Date</p>
              <p className="text-sm font-medium">{formatDate(project.startDate)}</p>
            </div>
            {project.endDate && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">End Date</p>
                <p className="text-sm font-medium">{formatDate(project.endDate)}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="text-sm font-medium">
                {project.endDate
                  ? `${Math.ceil((project.endDate - project.startDate) / (1000 * 60 * 60 * 24))} days`
                  : "Ongoing"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Section */}
      <Card className="border border-orange-100 rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-orange-500" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Project Manager */}
            {project.manager && (
              <div className="pb-4 border-b">
                <p className="text-xs text-muted-foreground mb-3">Project Manager</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-orange-200">
                    <AvatarImage
                      src={project.manager.imageUrl}
                      alt={`${project.manager.firstName} ${project.manager.lastName}`}
                    />
                    <AvatarFallback className="bg-orange-500 text-white">
                      {project.manager.firstName.charAt(0)}
                      {project.manager.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {project.manager.firstName} {project.manager.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{project.manager.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members */}
            {project.team && project.team.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-3">Team Members</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.team.map((member) => (
                    <div key={member._id || member.email} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={member.imageUrl}
                          alt={`${member.firstName} ${member.lastName}`}
                        />
                        <AvatarFallback className="bg-pink-400 text-white text-xs">
                          {member.firstName.charAt(0)}
                          {member.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files Section */}
      {project.files && project.files.length > 0 && (
        <Card className="border border-orange-100 rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PaperclipIcon className="h-5 w-5 text-orange-500" />
              Attached Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {project.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-orange-100">
                      <PaperclipIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(file.url, "_blank")}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

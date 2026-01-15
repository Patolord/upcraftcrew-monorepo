"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { Button } from "@base-ui/react/button";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { ProjectDashboard } from "../_components/project-dashboard";
import { ProjectInfo } from "../_components/project-info";
import { ProjectKanban } from "../_components/project-kanban";
import type { Project } from "@/types/project";
import { ArrowLeftIcon, InfoIcon, BarChart3Icon, KanbanIcon } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [activeTab, setActiveTab] = useState<"info" | "kanban" | "dashboard">("info");

  // Validate that we have a valid project ID (not "all" or other invalid values)
  const isValidId = projectId && projectId !== "all" && !projectId.includes("/");

  // Fetch project data - only if we have a valid ID
  const project = useQuery(
    api.projects.getProjectById,
    isValidId ? { id: projectId as Id<"projects"> } : "skip",
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button className="btn btn-ghost btn-sm" onClick={() => router.push("/projects")}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project?.name}</h1>
            <p className="text-base-content/60 text-sm mt-1">{project?.client || ""}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed w-fit">
        <Button
          className={`tab ${activeTab === "info" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          <InfoIcon className="h-4 w-4 mr-2" />
          Informações
        </Button>
        <Button
          className={`tab ${activeTab === "kanban" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("kanban")}
        >
          <KanbanIcon className="h-4 w-4 mr-2" />
          Kanban
        </Button>
        <Button
          className={`tab ${activeTab === "dashboard" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <BarChart3Icon className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && <ProjectInfo project={project as unknown as Project} />}
      {activeTab === "kanban" && <ProjectKanban projectId={projectId as Id<"projects">} />}
      {activeTab === "dashboard" && <ProjectDashboard project={project} />}
    </div>
  );
}

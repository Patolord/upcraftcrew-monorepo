"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { Button } from "@base-ui/react/button";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { ProjectDashboard } from "../_components/project-dashboard";
import { ProjectInfo } from "../_components/project-info";
import { ProjectKanban } from "../_components/project-kanban";
import type { Project } from "@/types/project";
import { AlertCircleIcon, ArrowLeftIcon, InfoIcon, BarChart3Icon, KanbanIcon } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as Id<"projects">;

  const [activeTab, setActiveTab] = useState<"info" | "kanban" | "dashboard">("info");

  // Fetch project data
  const project = useQuery(api.projects.getProjectById, { id: projectId });

  const isLoading = project === undefined;
  const notFound = project === null;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="mt-4 text-base-content/60">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-6 flex items-cen  ter justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircleIcon className="h-16 w-16 text-error mb-4" />
          <h3 className="text-lg font-medium mb-2">Projeto não encontrado</h3>
          <p className="text-base-content/60 text-sm mb-4">
            O projeto que você está procurando não existe ou foi removido.
          </p>
          <Button className="btn btn-primary" onClick={() => router.push("/projects")}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar para Projetos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button className="btn btn-ghost btn-sm" onClick={() => router.push("/projects")}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-base-content/60 text-sm mt-1">{project.client}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed w-fit">
        <button
          type="button"
          className={`tab ${activeTab === "info" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          <InfoIcon className="h-4 w-4 mr-2" />
          Informações
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "kanban" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("kanban")}
        >
          <KanbanIcon className="h-4 w-4 mr-2" />
          Kanban
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "dashboard" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <BarChart3Icon className="h-4 w-4 mr-2" />
          Dashboard
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && <ProjectInfo project={project as unknown as Project} />}
      {activeTab === "kanban" && <ProjectKanban projectId={projectId} />}
      {activeTab === "dashboard" && <ProjectDashboard project={project} />}
    </div>
  );
}

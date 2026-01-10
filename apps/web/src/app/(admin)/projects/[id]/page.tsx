"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProjectInfo } from "@/components/projects/detail/ProjectInfo";
import { ProjectKanban } from "@/components/projects/detail/ProjectKanban";
import { ProjectDashboard } from "@/components/projects/detail/ProjectDashboard";
import type { Id } from "@workspace/backend/_generated/dataModel";

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
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <span className="iconify lucide--alert-circle size-16 text-error mb-4" />
          <h3 className="text-lg font-medium mb-2">Projeto não encontrado</h3>
          <p className="text-base-content/60 text-sm mb-4">
            O projeto que você está procurando não existe ou foi removido.
          </p>
          <Button className="btn btn-primary" onClick={() => router.push("/projects")}>
            <span className="iconify lucide--arrow-left size-4 mr-2" />
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
            <span className="iconify lucide--arrow-left size-4" />
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
          <span className="iconify lucide--info size-4 mr-2" />
          Informações
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "kanban" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("kanban")}
        >
          <span className="iconify lucide--layout-kanban size-4 mr-2" />
          Kanban
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "dashboard" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <span className="iconify lucide--bar-chart-3 size-4 mr-2" />
          Dashboard
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && <ProjectInfo project={project} />}
      {activeTab === "kanban" && <ProjectKanban projectId={projectId} />}
      {activeTab === "dashboard" && <ProjectDashboard project={project} />}
    </div>
  );
}

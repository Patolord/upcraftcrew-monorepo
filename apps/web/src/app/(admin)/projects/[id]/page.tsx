"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Button } from "@base-ui/react/button";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { ProjectDashboard } from "../_components/project-dashboard";
import { ProjectInfo } from "../_components/project-info";
import { ProjectKanban } from "../_components/project-kanban";
import type { Project } from "@/types/project";
import {
  ArrowLeftIcon,
  InfoIcon,
  BarChart3Icon,
  KanbanIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { useEnsureCurrentUser } from "@/hooks/use-ensure-current-user";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  useEnsureCurrentUser();

  const [activeTab, setActiveTab] = useState<"info" | "kanban" | "dashboard">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProject = useMutation(api.projects.deleteProject);

  // Validate that we have a valid project ID (not "all" or other invalid values)
  const isValidId = projectId && projectId !== "all" && !projectId.includes("/");

  // Fetch project data - only if we have a valid ID
  const project = useQuery(
    api.projects.getProjectById,
    isValidId ? { id: projectId as Id<"projects"> } : "skip",
  );

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.")) {
      return;
    }

    setIsDeleting(true);
    try {
      if (!projectId) return;
      await deleteProject({ id: projectId as Id<"projects"> });
      toast.success("Projeto excluído com sucesso!");
      router.push("/projects");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir projeto");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle loading state
  if (!isValidId) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>ID de projeto inválido</span>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (project === undefined) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Handle not found state
  if (project === null) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Projeto não encontrado</span>
        </div>
        <Button className="btn btn-primary mt-4" onClick={() => router.push("/projects")}>
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar para Projetos
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button className="btn btn-ghost pb-4 btn-sm" onClick={() => router.push("/projects")}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl pt-4 font-semibold">{project.name}</h1>
            <p className="text-base-content/60 pt-2 text-sm mt-1">{project.client || ""}</p>
          </div>
        </div>
      </div>

      {/* Tabs and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="tabs tabs-boxed justify-start p-2 items-center bg-white border border-base-300 rounded-lg w-fit">
          <Button
            className={`tab pr-2 items-center gap-2 ${activeTab === "info" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            <InfoIcon className="h-4 w-4" />
            <span>Informações</span>
          </Button>
          <Button
            className={`tab pr-2 items-center gap-2 ${activeTab === "kanban" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("kanban")}
          >
            <KanbanIcon className="h-4 w-4" />
            <span>Kanban</span>
          </Button>
          <Button
            className={`tab pr-2  items-center gap-2 ${activeTab === "dashboard" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart3Icon className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
        </div>

        {/* Action Buttons - only show on info tab */}
        {activeTab === "info" && (
          <div className="flex gap-2 items-center">
            <button
              className="btn rounded-lg bg-white text-orange-500 border border-orange-500 btn-error"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="loading text-orange-500 loading-spinner loading-sm" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2Icon className="h-4 w-4 text-orange-500" />
                </>
              )}
            </button>

            <button
              className="btn rounded-lg bg-white text-orange-500 border border-orange-500 btn-primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              <PencilIcon className="h-4 w-4 text-orange-500" />
            </button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <ProjectInfo
          project={project as unknown as Project}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
      {activeTab === "kanban" && <ProjectKanban projectId={projectId as Id<"projects">} />}
      {activeTab === "dashboard" && <ProjectDashboard project={project} />}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { ProjectDashboard } from "../_components/project-dashboard";
import { ProjectInfo } from "../_components/project-info";
import { ProjectKanban } from "../_components/project-kanban";
import { ProjectMessages } from "../_components/project-messages";
import { EditProjectModal } from "../_components/edit-project-modal";
import {
  ArrowLeftIcon,
  InfoIcon,
  BarChart3Icon,
  KanbanIcon,
  MessageSquareIcon,
  Trash2Icon,
  Loader2Icon,
  PencilIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useEnsureCurrentUser } from "@/hooks/use-ensure-current-user";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Project } from "@/types/project";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  useEnsureCurrentUser();

  const [activeTab, setActiveTab] = useState<"info" | "kanban" | "dashboard" | "messages">("info");
  const currentUser = useQuery(api.users.current);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const deleteProject = useMutation(api.projects.deleteProject);

  // Validate that we have a valid project ID (not "all" or other invalid values)
  const isValidId = projectId && projectId !== "all" && !projectId.includes("/");

  // Fetch project data - only if we have a valid ID
  const project = useQuery(
    api.projects.getProjectById,
    isValidId ? { id: projectId as Id<"projects"> } : "skip",
  );

  const handleDelete = async () => {
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
      setShowDeleteDialog(false);
    }
  };

  // Handle invalid ID
  if (!isValidId) {
    return (
      <div className="p-6 pl-12 pr-12 space-y-6">
        <Card className="p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <InfoIcon className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Invalid Project ID</h3>
          <p className="text-muted-foreground mb-4">
            The project ID provided is not valid. Please check the URL and try again.
          </p>
          <Button
            onClick={() => router.push("/projects")}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Card>
      </div>
    );
  }

  // Handle loading state
  if (project === undefined) {
    return (
      <div className="p-6 pl-12 pr-12 flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader2Icon className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Handle not found state
  if (project === null) {
    return (
      <div className="p-6 pl-12 pr-12 space-y-6">
        <Card className="p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <InfoIcon className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Project Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The project you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Button
            onClick={() => router.push("/projects")}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 pl-12 pr-12 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/projects")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Project Detail Header */}
      <header className="flex items-center justify-between py-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-medium text-shadow-sm text-foreground">{project.name}</h1>
          {project.client && <p className="text-muted-foreground text-sm mt-1">{project.client}</p>}
        </div>
      </header>

      {/* Tabs and Action Buttons */}
      <div className="flex items-center border-orange-100 justify-between gap-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="w-fit border border-orange-100 rounded-lg">
            <TabsTrigger value="info" className="gap-2">
              <InfoIcon className="h-4 w-4" />
              <span>Information</span>
            </TabsTrigger>
            <TabsTrigger value="kanban" className="gap-2">
              <KanbanIcon className="h-4 w-4" />
              <span>Kanban</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3Icon className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquareIcon className="h-4 w-4" />
              <span>Messages</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Action Buttons - only show on info tab */}
        {activeTab === "info" && (
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="border-red-200 text-red-600 rounded-md hover:bg-red-50 hover:text-red-700"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
              className="border-orange-200 text-orange-600 rounded-md hover:bg-orange-50 hover:text-orange-700"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsContent value="info">
          <ProjectInfo
            project={{
              ...project,
              manager: project.manager || undefined,
              team: project.team.filter(
                (member): member is NonNullable<typeof member> => member !== null,
              ),
            }}
          />
        </TabsContent>
        <TabsContent value="kanban">
          <ProjectKanban projectId={projectId as Id<"projects">} />
        </TabsContent>
        <TabsContent value="dashboard">
          <ProjectDashboard
            project={
              {
                ...project,
                id: project._id,
              } as unknown as Project & { _id: Id<"projects"> }
            }
          />
        </TabsContent>
        <TabsContent value="messages">
          {currentUser && (
            <ProjectMessages
              projectId={projectId as Id<"projects">}
              currentUser={{ _id: currentUser._id, role: currentUser.role }}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project &quot;
              {project.name}&quot; and remove all associated data including tasks, transactions, and
              events.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="bg-white rounded-lg">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-orange-500 hover:bg-orange-600 rounded-lg"
            >
              {isDeleting ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Project Modal */}
      {showEditModal && (
        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          project={project}
        />
      )}
    </div>
  );
}

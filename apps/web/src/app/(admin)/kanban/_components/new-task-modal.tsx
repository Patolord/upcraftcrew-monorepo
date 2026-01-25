"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon, ChevronUpIcon, XIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { useConvexError } from "@/hooks/use-convex-error";
import { ErrorAlert } from "@/components/ui/error-alert";
import React from "react";

type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";
type TaskPriority = "low" | "medium" | "high" | "urgent";

interface NewTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus?: TaskStatus;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: "A Fazer",
  "in-progress": "Em Progresso",
  review: "Revisão",
  done: "Concluído",
  blocked: "Bloqueado",
};

const priorityLabels: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Baixa", color: "#84cc16" },
  medium: { label: "Média", color: "#f59e0b" },
  high: { label: "Alta", color: "#f97316" },
  urgent: { label: "Urgente", color: "#ef4444" },
};

export function NewTaskModal({ open, onOpenChange, defaultStatus = "todo" }: NewTaskModalProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, clearError, handleError } = useConvexError();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: defaultStatus,
    priority: "medium" as TaskPriority,
    assignedTo: "",
    projectId: "",
    dueDate: "",
  });

  const createTask = useMutation(api.tasks.createTask);
  const teamMembers = useQuery(api.team.getTeamMembers);
  const projects = useQuery(api.projects.getProjects);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        status: defaultStatus,
        priority: "medium",
        assignedTo: "",
        projectId: "",
        dueDate: "",
      });
      setShowAdvanced(false);
      clearError();
    }
  }, [open, defaultStatus, clearError]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !isSubmitting) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange, isSubmitting]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask({
        title: formData.title,
        description: formData.description || "Sem descrição",
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo ? (formData.assignedTo as Id<"users">) : undefined,
        projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
      });

      toast.success("Tarefa criada com sucesso!");
      onOpenChange(false);
    } catch (err) {
      handleError(err, "Erro ao criar tarefa");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity pointer-events-none"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        onClick={handleClose}
      >
        <div
          className="relative w-full max-w-lg bg-admin-background rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-in fade-in zoom-in-95 overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 bg-admin-background border-b border-border">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-base-200"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>

            {/* Title */}
            <div>
              <h2 className="text-xl font-semibold text-base-content">Nova Tarefa</h2>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="mb-4">
                <ErrorAlert
                  code={error.code}
                  message={error.message}
                  title={error.title}
                  onDismiss={clearError}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                  Título *
                </Label>
                <Input
                  id="title"
                  placeholder="Digite o título da tarefa..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  autoFocus
                  className="border border-base-300 rounded-lg focus:border-orange-500"
                />
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as TaskStatus })
                    }
                    className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <Label htmlFor="priority" className="text-sm font-medium mb-2 block">
                    Prioridade
                  </Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as TaskPriority })
                    }
                    className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {Object.entries(priorityLabels).map(([key, { label }]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggle Advanced Options */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-base-content/60 hover:text-base-content"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? (
                  <>
                    <ChevronUpIcon className="size-4 mr-1" /> Menos opções
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="size-4 mr-1" /> Mais opções
                  </>
                )}
              </Button>

              {showAdvanced && (
                <div className="space-y-4 pt-4 border-t border-base-200">
                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                      Descrição
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Adicione uma descrição..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-20 border border-base-300 rounded-lg focus:border-orange-500"
                    />
                  </div>

                  {/* Assignee */}
                  <div>
                    <Label htmlFor="assignedTo" className="text-sm font-medium mb-2 block">
                      Atribuir para
                    </Label>
                    <select
                      id="assignedTo"
                      value={formData.assignedTo || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assignedTo: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Não atribuído</option>
                      {teamMembers?.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.firstName} {member.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project */}
                  <div>
                    <Label htmlFor="projectId" className="text-sm font-medium mb-2 block">
                      Projeto
                    </Label>
                    <select
                      id="projectId"
                      value={formData.projectId || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectId: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Nenhum projeto</option>
                      {projects?.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <Label htmlFor="dueDate" className="text-sm font-medium mb-2 block">
                      Data de Entrega
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="border border-base-300 rounded-lg focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSubmitting ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlusIcon className="h-4 w-4" />
                  )}
                  Criar Tarefa
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

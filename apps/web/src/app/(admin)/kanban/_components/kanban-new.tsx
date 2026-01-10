"use client";

import { useState, useId } from "react";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";
type TaskPriority = "low" | "medium" | "high" | "urgent";

export function NewTaskModal({ isOpen, onClose }: NewTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTask = useMutation(api.tasks.createTask);
  const projects = useQuery(api.projects.getProjects);
  const teamMembers = useQuery(api.team.getTeamMembers);
  const formId = useId();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    assignedTo: "" as string,
    projectId: "" as string,
    dueDate: "",
    tags: "",
    isPrivate: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo ? (formData.assignedTo as Id<"users">) : undefined,
        projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        isPrivate: formData.isPrivate,
      });

      toast.success("Task criada com sucesso!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        assignedTo: "",
        projectId: "",
        dueDate: "",
        tags: "",
        isPrivate: false,
      });

      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Falha ao criar task. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Criar Nova Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="form-control">
            <label htmlFor={`${formId}-title`} className="label">
              <span className="label-text">Título *</span>
            </label>
            <input
              id={`${formId}-title`}
              type="text"
              className="input input-bordered"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label htmlFor={`${formId}-description`} className="label">
              <span className="label-text">Descrição *</span>
            </label>
            <textarea
              id={`${formId}-description`}
              className="textarea textarea-bordered h-24"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor={`${formId}-status`} className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                id={`${formId}-status`}
                className="select select-bordered"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div className="form-control">
              <label htmlFor={`${formId}-priority`} className="label">
                <span className="label-text">Prioridade</span>
              </label>
              <select
                id={`${formId}-priority`}
                className="select select-bordered"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as TaskPriority })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Assigned To and Project */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor={`${formId}-assigned`} className="label">
                <span className="label-text">Atribuído a (opcional)</span>
              </label>
              <select
                id={`${formId}-assigned`}
                className="select select-bordered"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              >
                <option value="">Ninguém</option>
                {teamMembers?.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label htmlFor={`${formId}-project`} className="label">
                <span className="label-text">Projeto (opcional)</span>
              </label>
              <select
                id={`${formId}-project`}
                className="select select-bordered"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                <option value="">Nenhum</option>
                {projects?.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="form-control">
            <label htmlFor={`${formId}-due-date`} className="label">
              <span className="label-text">Data de Vencimento (opcional)</span>
            </label>
            <input
              id={`${formId}-due-date`}
              type="date"
              className="input input-bordered"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Tags */}
          <div className="form-control">
            <label htmlFor={`${formId}-tags`} className="label">
              <span className="label-text">Tags (separadas por vírgula)</span>
            </label>
            <input
              id={`${formId}-tags`}
              type="text"
              className="input input-bordered"
              placeholder="frontend, bug, urgent"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          {/* Private Toggle */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
              />
              <div className="flex items-center gap-2">
                <span className="iconify lucide--lock size-4" />
                <span className="label-text">Task Privada</span>
              </div>
            </label>
            <p className="text-xs text-base-content/60 ml-12">
              Tasks privadas só são visíveis para você
            </p>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <Button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Criando...
                </>
              ) : (
                "Criar Task"
              )}
            </Button>
          </div>
        </form>
      </div>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
    </div>
  );
}

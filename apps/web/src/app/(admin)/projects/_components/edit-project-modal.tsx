"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
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
    managerId: Id<"users">;
    teamIds: Id<"users">[];
    notes?: string;
  };
}

type ProjectStatus = "planning" | "in-progress" | "completed";
type ProjectPriority = "low" | "medium" | "high" | "urgent";

type FormData = {
  name: string;
  client: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  progress: number;
  budget: string;
  managerId: Id<"users"> | "";
  teamIds: Id<"users">[];
  notes: string;
};

export function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProject = useMutation(api.projects.updateProject);
  const teamMembers = useQuery(api.team.getTeamMembers) || [];

  const [formData, setFormData] = useState<FormData>({
    name: project.name,
    client: project.client || "",
    description: project.description,
    status: project.status,
    priority: project.priority,
    startDate: new Date(project.startDate).toISOString().split("T")[0],
    endDate: project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : "",
    progress: project.progress,
    budget: project.budget?.toString() || "",
    managerId: project.managerId,
    teamIds: project.teamIds,
    notes: project.notes || "",
  });

  // Update form when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        client: project.client || "",
        description: project.description,
        status: project.status,
        priority: project.priority,
        startDate: new Date(project.startDate).toISOString().split("T")[0],
        endDate: project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : "",
        progress: project.progress,
        budget: project.budget?.toString() || "",
        managerId: project.managerId,
        teamIds: project.teamIds,
        notes: project.notes || "",
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.client || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.managerId) {
      toast.error("Please select a project manager");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProject({
        id: project._id,
        name: formData.name,
        client: formData.client,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        startDate: new Date(formData.startDate).getTime(),
        endDate: formData.endDate ? new Date(formData.endDate).getTime() : undefined,
        progress: formData.progress,
        budget: parseFloat(formData.budget) || 0,
        managerId: formData.managerId as Id<"users">,
        teamIds: formData.teamIds,
        notes: formData.notes,
      });

      toast.success("Project updated successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the project details below. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and Client */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                placeholder="Enter client name"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter project description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          {/* Project Manager */}
          <div className="space-y-2">
            <Label htmlFor="managerId">Project Manager *</Label>
            <select
              id="managerId"
              value={formData.managerId}
              onChange={(e) =>
                setFormData({ ...formData, managerId: e.target.value as Id<"users"> | "" })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="">Select a manager</option>
              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.firstName} {member.lastName} - {member.role}
                </option>
              ))}
            </select>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as ProjectStatus })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as ProjectPriority })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Label htmlFor="progress">Progress: {formData.progress}%</Label>
            <Input
              id="progress"
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <Label htmlFor="teamIds">Team Members (Optional)</Label>
            <select
              id="teamIds"
              multiple
              value={formData.teamIds}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value,
                );
                setFormData({
                  ...formData,
                  teamIds: selectedOptions as Id<"users">[],
                });
              }}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {teamMembers
                .filter((member) => member._id !== formData.managerId)
                .map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.firstName} {member.lastName} - {member.department || member.role}
                  </option>
                ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Hold Ctrl/Cmd to select multiple team members
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

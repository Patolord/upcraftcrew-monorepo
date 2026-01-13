"use client";

import { useState, useId } from "react";
import { useMutation } from "convex/react";
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
import { toast } from "sonner";

interface DashboardNewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  client: string;
  description: string;
  status: "planning" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
}

export function DashboardNewProjectModal({ open, onOpenChange }: DashboardNewProjectModalProps) {
  const id = useId();
  const createProject = useMutation(api.projects.createProject);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    client: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    progress: 0,
    budget: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      client: "",
      description: "",
      status: "planning",
      priority: "medium",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      progress: 0,
      budget: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProject({
        name: formData.name,
        client: formData.client,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        startDate: new Date(formData.startDate).getTime(),
        endDate: new Date(formData.endDate).getTime(),
        progress: formData.progress,
        budget: formData.budget,
        teamIds: [],
      });

      toast.success("Project created successfully!");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] rounded-lg border border-orange-500 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Fill in the details to create a new project</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-name`}>Project Name *</Label>
              <Input
                id={`${id}-name`}
                required
                value={formData.name}
                className="rounded-md"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-client`}>Client *</Label>
              <Input
                id={`${id}-client`}
                required
                value={formData.client}
                className="rounded-md"
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${id}-description`}>Description *</Label>
            <Input
              id={`${id}-description`}
              required
              value={formData.description}
              className="rounded-md"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-status`}>Status</Label>
              <select
                id={`${id}-status`}
                className="input input-bordered w-full rounded-md"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "planning" | "in-progress" | "completed",
                  })
                }
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-priority`}>Priority</Label>
              <select
                id={`${id}-priority`}
                className="input input-bordered w-full rounded-md"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as "low" | "medium" | "high" | "urgent",
                  })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-startDate`}>Start Date *</Label>
              <Input
                id={`${id}-startDate`}
                type="date"
                required
                value={formData.startDate}
                className="rounded-md"
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-endDate`}>End Date *</Label>
              <Input
                id={`${id}-endDate`}
                type="date"
                required
                value={formData.endDate}
                className="rounded-md"
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-budget`}>Total Budget *</Label>
              <Input
                id={`${id}-budget`}
                required
                value={formData.budget}
                className="rounded-md"
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) || 0 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              className="border-orange-500 text-orange-500 rounded-lg"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 border-orange-500 text-white rounded-lg">
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

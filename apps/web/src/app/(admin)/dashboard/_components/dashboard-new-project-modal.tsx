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
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  tags: string;
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
    budget: {
      total: 0,
      spent: 0,
      remaining: 0,
    },
    tags: "",
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
      budget: {
        total: 0,
        spent: 0,
        remaining: 0,
      },
      tags: "",
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
        budget: {
          total: formData.budget.total,
          spent: formData.budget.spent,
          remaining: formData.budget.total - formData.budget.spent,
        },
        teamIds: [],
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-client`}>Client *</Label>
              <Input
                id={`${id}-client`}
                required
                value={formData.client}
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-status`}>Status</Label>
              <select
                id={`${id}-status`}
                className="input input-bordered w-full"
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
                className="input input-bordered w-full"
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
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-budgetTotal`}>Total Budget *</Label>
              <Input
                id={`${id}-budgetTotal`}
                type="number"
                required
                min="0"
                value={formData.budget.total}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: {
                      ...formData.budget,
                      total: Number(e.target.value),
                      remaining: Number(e.target.value) - formData.budget.spent,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-budgetSpent`}>Budget Spent</Label>
              <Input
                id={`${id}-budgetSpent`}
                type="number"
                min="0"
                value={formData.budget.spent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: {
                      ...formData.budget,
                      spent: Number(e.target.value),
                      remaining: formData.budget.total - Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${id}-tags`}>Tags (comma-separated)</Label>
            <Input
              id={`${id}-tags`}
              placeholder="design, development, marketing"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

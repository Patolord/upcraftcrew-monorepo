"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Loader2Icon,
  UsersIcon,
  ClipboardListIcon,
  RocketIcon,
  CheckCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Doc, Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers?: TeamMember[];
}

type ProjectStatus = "planning" | "in-progress" | "completed";
type ProjectPriority = "low" | "medium" | "high" | "urgent";
type TeamMember = Doc<"users">;

const STATUS_OPTIONS = [
  { value: "planning", label: "Planejamento", icon: ClipboardListIcon, color: "text - blue - 500" },
  { value: "in-progress", label: "Em Progresso", icon: RocketIcon, color: "text-amber-500" },
  { value: "completed", label: "Concluído", icon: CheckCircleIcon, color: "text-green-500" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "low", label: "Baixa", color: "bg-green-100 text-green-700" },
  { value: "medium", label: "Média", color: "bg-amber-100 text-amber-700" },
  { value: "high", label: "Alta", color: "bg-red-100 text-red-700" },
  { value: "urgent", label: "Urgente", color: "bg-purple-100 text-purple-700" },
] as const;

type FormData = {
  name: string;
  client: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  progress: number;
  budgetTotal: string;
  budgetSpent: string;
  managerId: Id<"users"> | "";
  teamIds: Id<"users">[];
};

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProject = useMutation(api.projects.createProject);
  const teamMembers = useQuery(api.team.getTeamMembers) || [];

  const [formData, setFormData] = useState<FormData>({
    name: "",
    client: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    progress: 0,
    budgetTotal: "",
    budgetSpent: "",
    managerId: "",
    teamIds: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.client || !formData.description) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!formData.managerId) {
      toast.error("Por favor, selecione um gerente de projeto");
      return;
    }

    setIsSubmitting(true);

    try {
      await createProject({
        name: formData.name,
        client: formData.client,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        startDate: new Date(formData.startDate).getTime(),
        endDate: formData.endDate ? new Date(formData.endDate).getTime() : new Date().getTime(),
        progress: formData.progress,
        budget: parseFloat(formData.budgetTotal) || 0,
        managerId: formData.managerId as Id<"users">,
        teamIds: formData.teamIds,
      });

      toast.success("Projeto criado com sucesso!");

      // Reset form
      setFormData({
        name: "",
        client: "",
        description: "",
        status: "planning",
        priority: "medium",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        progress: 0,
        budgetTotal: "",
        budgetSpent: "",
        managerId: "",
        teamIds: [],
      });

      onClose();
    } catch (error) {
      console.error("Falha ao criar projeto:", error);
      toast.error("Falha ao criar projeto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const toggleTeamMember = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      teamIds: prev.teamIds.includes(memberId as Id<"users">)
        ? prev.teamIds.filter((id) => id !== memberId)
        : [...prev.teamIds, memberId as Id<"users">],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] bg-admin-background overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Criar Novo Projeto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and Client */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Projeto *</Label>
              <Input
                id="name"
                placeholder="Digite o nome do projeto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Cliente *</Label>
              <Input
                id="client"
                placeholder="Digite o nome do cliente"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="rounded-lg"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Digite a descrição do projeto"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="rounded-lg resize-none"
              required
            />
          </div>

          {/* Project Manager */}
          <div className="space-y-2">
            <Label>Gerente do Projeto *</Label>
            <Select
              value={formData.managerId}
              onValueChange={(value) =>
                setFormData({ ...formData, managerId: value as Id<"users"> | "" })
              }
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Selecione um gerente" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.firstName} {member.lastName} - {member.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status do Projeto</Label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((status) => {
                const Icon = status.icon;
                const isSelected = formData.status === status.value;
                return (
                  <button
                    key={status.value}
                    onClick={() => setFormData({ ...formData, status: status.value })}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors",
                      isSelected
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-border hover:border-orange-300 hover:bg-muted/50",
                    )}
                  >
                    <Icon
                      className={cn("h-4 w-4", isSelected ? "text-orange-500" : status.color)}
                    />
                    <span>{status.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Prioridade do Projeto</Label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((priority) => (
                <button
                  key={priority.value}
                  onClick={() => setFormData({ ...formData, priority: priority.value })}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    formData.priority === priority.value
                      ? priority.color
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="rounded-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Término</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="budgetTotal">Total do Orçamento</Label>
              <Input
                id="budgetTotal"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.budgetTotal}
                onChange={(e) => setFormData({ ...formData, budgetTotal: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetSpent">Orçamento Gasto</Label>
              <Input
                id="budgetSpent"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.budgetSpent}
                onChange={(e) => setFormData({ ...formData, budgetSpent: e.target.value })}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Label htmlFor="progress">Progresso: {formData.progress}%</Label>
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
            <Label>
              <UsersIcon className="h-3.5 w-3.5 inline mr-1" />
              Membros da Equipe ({formData.teamIds.length} selecionados)
            </Label>
            <div className="border rounded-lg max-h-32 overflow-y-auto">
              {teamMembers
                .filter((member) => member._id !== formData.managerId)
                .map((member) => {
                  const isSelected = formData.teamIds.includes(member._id);
                  return (
                    <div
                      key={member._id}
                      onClick={() => toggleTeamMember(member._id)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors",
                        isSelected && "bg-orange-50",
                      )}
                    >
                      <Checkbox checked={isSelected} />
                      <Image
                        src={member.imageUrl || ""}
                        alt={`${member.firstName} ${member.lastName}`}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className={cn("text-sm", isSelected && "text-orange-700 font-medium")}>
                        {member.firstName} {member.lastName}
                      </span>
                    </div>
                  );
                })}
              {teamMembers.filter((member) => member._id !== formData.managerId).length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  Nenhum membro da equipe disponível.
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Projeto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

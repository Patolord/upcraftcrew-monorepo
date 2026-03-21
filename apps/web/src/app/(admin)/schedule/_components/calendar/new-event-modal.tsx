"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
  Loader2Icon,
  PartyPopperIcon,
  VideoIcon,
  CalendarDaysIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface NewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedDate?: Date;
  projectId: string;
}

const EVENT_TYPES = [
  { value: "meeting", label: "Reunião", icon: VideoIcon, color: "text-blue-500" },
  { value: "event", label: "Evento", icon: CalendarDaysIcon, color: "text-purple-500" },
  {
    value: "confraternization",
    label: "Confraternização",
    icon: PartyPopperIcon,
    color: "text-pink-500",
  },
  { value: "deadline", label: "Deadline", icon: CalendarIcon, color: "text-red-500" },
  { value: "reminder", label: "Lembrete", icon: CalendarIcon, color: "text-amber-500" },
] as const;

const PRIORITIES = [
  { value: "low", label: "Baixa", color: "bg-green-100 text-green-700" },
  { value: "medium", label: "Média", color: "bg-amber-100 text-amber-700" },
  { value: "high", label: "Alta", color: "bg-red-100 text-red-700" },
] as const;

export function NewEventModal({ open, onOpenChange, preSelectedDate }: NewEventModalProps) {
  const createEvent = useMutation(api.schedule.createEvent);
  const teamMembers = useQuery(api.team.getTeamMembers);
  const projects = useQuery(api.projects.getProjects);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get default date from preSelectedDate or today
  const getDefaultDate = () => {
    const date = preSelectedDate || new Date();
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "meeting" as string,
    date: getDefaultDate(),
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    projectId: "",
    priority: "medium" as "low" | "medium" | "high",
    attendeeIds: [] as string[],
  });

  // Reset form when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setFormData({
        title: "",
        description: "",
        type: "meeting",
        date: getDefaultDate(),
        startTime: "09:00",
        endTime: "10:00",
        location: "",
        projectId: "",
        priority: "medium",
        attendeeIds: [],
      });
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Por favor, insira um título para o evento");
      return;
    }

    setIsSubmitting(true);

    try {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`).getTime();
      const endDateTime = new Date(`${formData.date}T${formData.endTime}:00`).getTime();

      if (endDateTime <= startDateTime) {
        toast.error("O horário de término deve ser depois do horário de início");
        setIsSubmitting(false);
        return;
      }

      await createEvent({
        title: formData.title,
        description: formData.description || "Sem descrição",
        type: formData.type,
        startTime: startDateTime,
        endTime: endDateTime,
        location: formData.location || undefined,
        attendeeIds: formData.attendeeIds.map((id) => id as Id<"users">),
        projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
        priority: formData.priority,
      });

      toast.success("Evento criado com sucesso!");
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("Falha ao criar evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAttendee = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      attendeeIds: prev.attendeeIds.includes(memberId)
        ? prev.attendeeIds.filter((id) => id !== memberId)
        : [...prev.attendeeIds, memberId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-admin-background">
        <DialogHeader>
          <DialogTitle className="text-lg">Novo Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Nome do evento"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-lg"
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label>Tipo de Evento</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EVENT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors",
                      isSelected
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-border hover:border-orange-300 hover:bg-muted/50",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isSelected ? "text-orange-500" : type.color)} />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Início</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Término</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              <MapPinIcon className="h-3.5 w-3.5 inline mr-1" />
              Localização (opcional)
            </Label>
            <Input
              id="location"
              placeholder="Local do evento ou link da reunião"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="rounded-lg"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Prioridade</Label>
            <div className="flex gap-2">
              {PRIORITIES.map((priority) => (
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

          {/* Project (optional) */}
          <div className="space-y-2">
            <Label>Projeto (opcional)</Label>
            <Select
              value={formData.projectId || ""}
              onValueChange={(value) => setFormData({ ...formData, projectId: value || "" })}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Selecione um projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum projeto</SelectItem>
                {projects?.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Detalhes sobre o evento..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-lg resize-none"
              rows={2}
            />
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <Label>
              <UsersIcon className="h-3.5 w-3.5 inline mr-1" />
              Participantes ({formData.attendeeIds.length} selecionados)
            </Label>
            <div className="border rounded-lg max-h-32 overflow-y-auto">
              {teamMembers?.map((member) => {
                const isSelected = formData.attendeeIds.includes(member._id);
                return (
                  <div
                    key={member._id}
                    onClick={() => toggleAttendee(member._id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors",
                      isSelected && "bg-orange-50",
                    )}
                  >
                    <Checkbox checked={isSelected} />
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={`${member.firstName} ${member.lastName}`}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        {member.firstName?.[0]}
                        {member.lastName?.[0]}
                      </div>
                    )}
                    <span className={cn("text-sm", isSelected && "text-orange-700 font-medium")}>
                      {member.firstName} {member.lastName}
                    </span>
                  </div>
                );
              })}
              {!teamMembers?.length && (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  Nenhum membro da equipe encontrado
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
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
                "Criar Evento"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

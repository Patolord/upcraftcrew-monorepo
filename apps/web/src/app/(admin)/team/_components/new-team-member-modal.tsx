"use client";

import { useId, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeamMemberStatus } from "@/types/team";
import { useConvexError } from "@/hooks/use-convex-error";
import { ErrorAlert } from "@/components/ui/error-alert";
import { XIcon, Loader2Icon, UserPlusIcon } from "lucide-react";
import React from "react";

interface NewTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMemberFormData {
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  department: string;
  status: TeamMemberStatus;
  skills: string;
  imageUrl: string;
}

export function NewTeamMemberModal({ isOpen, onClose }: NewTeamMemberModalProps) {
  const formId = useId();
  const { error, clearError } = useConvexError();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberFormData>({
    defaultValues: {
      name: "",
      email: "",
      role: "member",
      department: "",
      status: "offline",
      skills: "",
      imageUrl: "",
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset();
      clearError();
    }
  }, [isOpen, reset, clearError]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const onSubmit = (data: TeamMemberFormData) => {
    // TODO: Implement actual team member creation
    console.log("Form data:", data);
  };

  if (!isOpen) return null;

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
        onClick={onClose}
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
              onClick={onClose}
              className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-base-200"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>

            {/* Title */}
            <div>
              <h2 className="text-xl font-semibold text-base-content">Novo Membro da Equipe</h2>
              <p className="text-sm text-base-content/60 mt-1">
                Adicione um novo membro à sua equipe
              </p>
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor={`${formId}-name`} className="text-sm font-medium mb-2 block">
                  Nome Completo *
                </Label>
                <Input
                  id={`${formId}-name`}
                  type="text"
                  placeholder="João Silva"
                  className="border border-base-300 rounded-lg focus:border-orange-500"
                  {...register("name", {
                    required: "Nome é obrigatório",
                    minLength: {
                      value: 2,
                      message: "Nome deve ter pelo menos 2 caracteres",
                    },
                  })}
                />
                {errors.name && (
                  <span className="text-sm text-error mt-1">{errors.name.message}</span>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor={`${formId}-email`} className="text-sm font-medium mb-2 block">
                  Email *
                </Label>
                <Input
                  id={`${formId}-email`}
                  type="email"
                  placeholder="joao@empresa.com"
                  className="border border-base-300 rounded-lg focus:border-orange-500"
                  {...register("email", {
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-sm text-error mt-1">{errors.email.message}</span>
                )}
              </div>

              {/* Role and Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${formId}-role`} className="text-sm font-medium mb-2 block">
                    Nível de Permissão *
                  </Label>
                  <select
                    id={`${formId}-role`}
                    className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    {...register("role", {
                      required: "Nível é obrigatório",
                    })}
                  >
                    <option value="viewer">Visualizador</option>
                    <option value="member">Membro</option>
                    <option value="admin">Administrador</option>
                  </select>
                  {errors.role && (
                    <span className="text-sm text-error mt-1">{errors.role.message}</span>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor={`${formId}-department`}
                    className="text-sm font-medium mb-2 block"
                  >
                    Departamento *
                  </Label>
                  <select
                    id={`${formId}-department`}
                    className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    {...register("department", {
                      required: "Departamento é obrigatório",
                      validate: (value) => value !== "" || "Selecione um departamento",
                    })}
                  >
                    <option value="">Selecione</option>
                    <option value="Engineering">Engenharia</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Vendas</option>
                    <option value="Product">Produto</option>
                    <option value="HR">RH</option>
                    <option value="Finance">Financeiro</option>
                    <option value="Operations">Operações</option>
                  </select>
                  {errors.department && (
                    <span className="text-sm text-error mt-1">{errors.department.message}</span>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor={`${formId}-status`} className="text-sm font-medium mb-2 block">
                  Status Inicial
                </Label>
                <select
                  id={`${formId}-status`}
                  className="w-full h-10 px-3 text-sm border border-base-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  {...register("status")}
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="away">Ausente</option>
                  <option value="busy">Ocupado</option>
                </select>
              </div>

              {/* Skills */}
              <div>
                <Label htmlFor={`${formId}-skills`} className="text-sm font-medium mb-2 block">
                  Habilidades (separadas por vírgula)
                </Label>
                <Input
                  id={`${formId}-skills`}
                  type="text"
                  placeholder="React, TypeScript, Node.js"
                  className="border border-base-300 rounded-lg focus:border-orange-500"
                  {...register("skills")}
                />
              </div>

              {/* Avatar URL */}
              <div>
                <Label htmlFor={`${formId}-imageUrl`} className="text-sm font-medium mb-2 block">
                  URL do Avatar (opcional)
                </Label>
                <Input
                  id={`${formId}-imageUrl`}
                  type="url"
                  placeholder="https://exemplo.com/avatar.jpg"
                  className="border border-base-300 rounded-lg focus:border-orange-500"
                  {...register("imageUrl", {
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                      message: "URL inválida",
                    },
                  })}
                />
                {errors.imageUrl && (
                  <span className="text-sm text-error mt-1">{errors.imageUrl.message}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-200">
                <Button type="button" variant="outline" onClick={onClose}>
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
                    <UserPlusIcon className="h-4 w-4" />
                  )}
                  Adicionar Membro
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useId } from "react";
import { Form, FormSubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TeamMemberStatus } from "@/types/team";
import { useConvexError } from "@/hooks/use-convex-error";
import { ErrorAlert } from "@/components/ui/error-alert";

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
  const createTeamMember = useMutation(api.team.createTeamMember);
  const formId = useId();
  const { error, clearError, handleErrorWithMessages } = useConvexError();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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

  const onSubmit = async (data: TeamMemberFormData) => {
    try {
      await createTeamMember({
        firstName: data.name,
        lastName: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        skills: data.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
        imageUrl: data.imageUrl || undefined,
      });

      toast.success("Team member added successfully!");
      reset();
      onClose();
    } catch (err) {
      handleErrorWithMessages(
        err,
        {
          ALREADY_EXISTS: "Um usuário com este email já existe",
          UNAUTHORIZED: "Você não tem permissão para adicionar membros",
        },
        "Erro ao adicionar membro",
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Add New Team Member</h3>

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

        <Form className="space-y-4">
          {/* Name */}
          <div className="form-control">
            <label htmlFor={`${formId}-name`} className="label">
              <span className="label-text">Full Name *</span>
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              className="input input-bordered"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <span className="label-text-alt text-error mt-1">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-control">
            <label htmlFor={`${formId}-email`} className="label">
              <span className="label-text">Email *</span>
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              className="input input-bordered"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <span className="label-text-alt text-error mt-1">{errors.email.message}</span>
            )}
          </div>

          {/* Role and Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor={`${formId}-role`} className="label">
                <span className="label-text">Permission Level *</span>
              </label>
              <select
                id={`${formId}-role`}
                className="select select-bordered"
                {...register("role", {
                  required: "Role is required",
                })}
              >
                <option value="viewer">Viewer</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <span className="label-text-alt text-error mt-1">{errors.role.message}</span>
              )}
            </div>
            <div className="form-control">
              <label htmlFor={`${formId}-department`} className="label">
                <span className="label-text">Department *</span>
              </label>
              <select
                id={`${formId}-department`}
                className="select select-bordered"
                {...register("department", {
                  required: "Department is required",
                  validate: (value) => value !== "" || "Please select a department",
                })}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Product">Product</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
              {errors.department && (
                <span className="label-text-alt text-error mt-1">{errors.department.message}</span>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="form-control">
            <label htmlFor={`${formId}-status`} className="label">
              <span className="label-text">Initial Status</span>
            </label>
            <select
              id={`${formId}-status`}
              className="select select-bordered"
              {...register("status")}
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="away">Away</option>
              <option value="busy">Busy</option>
            </select>
          </div>

          {/* Skills */}
          <div className="form-control">
            <label htmlFor={`${formId}-skills`} className="label">
              <span className="label-text">Skills (comma separated)</span>
            </label>
            <input
              id={`${formId}-skills`}
              type="text"
              className="input input-bordered"
              placeholder="React, TypeScript, Node.js"
              {...register("skills")}
            />
          </div>

          {/* Avatar URL */}
          <div className="form-control">
            <label htmlFor={`${formId}-imageUrl`} className="label">
              <span className="label-text">Avatar URL (optional)</span>
            </label>
            <input
              id={`${formId}-imageUrl`}
              type="url"
              className="input input-bordered"
              placeholder="https://example.com/avatar.jpg"
              {...register("imageUrl", {
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: "Invalid URL format",
                },
              })}
            />
            {errors.imageUrl && (
              <span className="label-text-alt text-error mt-1">{errors.imageUrl.message}</span>
            )}
          </div>

          {/* Actions */}
          <div className="modal-action">
            <Button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Adding...
                </>
              ) : (
                "Add Team Member"
              )}
            </Button>
          </div>
        </Form>
      </div>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
    </div>
  );
}

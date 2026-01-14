"use client";

import { useState, useId } from "react";
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

export function NewTeamMemberModal({ isOpen, onClose }: NewTeamMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTeamMember = useMutation(api.team.createTeamMember);
  const formId = useId();
  const { error, clearError, handleErrorWithMessages } = useConvexError();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member" as "admin" | "member" | "viewer",
    department: "",
    status: "offline" as TeamMemberStatus,
    skills: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createTeamMember({
        firstName: formData.name,
        lastName: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
        imageUrl: formData.imageUrl || undefined,
      });

      toast.success("Team member added successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "member",
        department: "",
        status: "offline",
        skills: "",
        imageUrl: "",
      });

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
    } finally {
      setIsSubmitting(false);
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="form-control">
            <label htmlFor={`${formId}-name`} className="label">
              <span className="label-text">Full Name *</span>
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              className="input input-bordered"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
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
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as typeof formData.role })
                }
                required
              >
                <option value="viewer">Viewer</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-control">
              <label htmlFor={`${formId}-department`} className="label">
                <span className="label-text">Department *</span>
              </label>
              <select
                id={`${formId}-department`}
                className="select select-bordered"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
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
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as typeof formData.status })
              }
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
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
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
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
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
        </form>
      </div>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
    </div>
  );
}

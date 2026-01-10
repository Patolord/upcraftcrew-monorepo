"use client";

import { useState, useId } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Id } from "@workspace/backend/_generated/dataModel";

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedDate?: Date;
}

export function NewEventModal({ isOpen, onClose, preSelectedDate }: NewEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createEvent = useMutation(api.schedule.createEvent);
  const teamMembers = useQuery(api.team.getTeamMembers);
  const projects = useQuery(api.projects.getProjects);
  const formId = useId();

  const defaultDate = preSelectedDate || new Date();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "meeting",
    startDate: defaultDate.toISOString().split("T")[0],
    startTime: "09:00",
    endDate: defaultDate.toISOString().split("T")[0],
    endTime: "10:00",
    location: "",
    attendeeIds: [] as Id<"users">[],
    projectId: "" as string,
    priority: "medium" as "low" | "medium" | "high",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).getTime();
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).getTime();

      if (endDateTime <= startDateTime) {
        toast.error("End time must be after start time");
        setIsSubmitting(false);
        return;
      }

      await createEvent({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        startTime: startDateTime,
        endTime: endDateTime,
        location: formData.location || undefined,
        attendeeIds: formData.attendeeIds,
        projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
        priority: formData.priority,
      });

      toast.success("Event created successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "meeting",
        startDate: defaultDate.toISOString().split("T")[0],
        startTime: "09:00",
        endDate: defaultDate.toISOString().split("T")[0],
        endTime: "10:00",
        location: "",
        attendeeIds: [],
        projectId: "",
        priority: "medium",
      });

      onClose();
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttendeeToggle = (userId: Id<"users">) => {
    setFormData((prev) => ({
      ...prev,
      attendeeIds: prev.attendeeIds.includes(userId)
        ? prev.attendeeIds.filter((id) => id !== userId)
        : [...prev.attendeeIds, userId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">Create New Event</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="form-control">
            <label htmlFor={`${formId}-title`} className="label">
              <span className="label-text">Event Title *</span>
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
              <span className="label-text">Description *</span>
            </label>
            <textarea
              id={`${formId}-description`}
              className="textarea textarea-bordered h-20"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor={`${formId}-type`} className="label">
                <span className="label-text">Event Type</span>
              </label>
              <select
                id={`${formId}-type`}
                className="select select-bordered"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
                <option value="milestone">Milestone</option>
                <option value="review">Review</option>
                <option value="presentation">Presentation</option>
                <option value="training">Training</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-control">
              <label htmlFor={`${formId}-priority`} className="label">
                <span className="label-text">Priority</span>
              </label>
              <select
                id={`${formId}-priority`}
                className="select select-bordered"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as typeof formData.priority })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Start Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor={`${formId}-start-date`} className="label">
                <span className="label-text">Start Date *</span>
              </label>
              <input
                id={`${formId}-start-date`}
                type="date"
                className="input input-bordered"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor={`${formId}-start-time`} className="label">
                <span className="label-text">Start Time *</span>
              </label>
              <input
                id={`${formId}-start-time`}
                type="time"
                className="input input-bordered"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* End Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor={`${formId}-end-date`} className="label">
                <span className="label-text">End Date *</span>
              </label>
              <input
                id={`${formId}-end-date`}
                type="date"
                className="input input-bordered"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor={`${formId}-end-time`} className="label">
                <span className="label-text">End Time *</span>
              </label>
              <input
                id={`${formId}-end-time`}
                type="time"
                className="input input-bordered"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-control">
            <label htmlFor={`${formId}-location`} className="label">
              <span className="label-text">Location (optional)</span>
            </label>
            <input
              id={`${formId}-location`}
              type="text"
              className="input input-bordered"
              placeholder="Meeting Room A, Zoom, etc."
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Project */}
          <div className="form-control">
            <label htmlFor={`${formId}-project`} className="label">
              <span className="label-text">Related Project (optional)</span>
            </label>
            <select
              id={`${formId}-project`}
              className="select select-bordered"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            >
              <option value="">None</option>
              {projects?.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Attendees */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Attendees</span>
            </label>
            <div className="border border-base-300 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
              {teamMembers?.map((member) => (
                <label
                  key={member._id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={formData.attendeeIds.includes(member._id)}
                    onChange={() => handleAttendeeToggle(member._id)}
                  />
                  <span className="text-sm">{member.name}</span>
                  <span className="text-xs text-base-content/60">({member.email})</span>
                </label>
              ))}
            </div>
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
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </div>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
    </div>
  );
}

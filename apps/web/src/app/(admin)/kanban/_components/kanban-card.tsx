import Image from "next/image";
import type { Project } from "@/types/project";
import { CalendarIcon, FlagIcon } from "lucide-react";
import React from "react";

const priorityConfig = {
  low: {
    label: "Low",
    color: "text-base-content/60",
    icon: "FlagIcon",
  },
  medium: {
    label: "Medium",
    color: "text-info",
    icon: "FlagIcon",
  },
  high: {
    label: "High",
    color: "text-warning",
    icon: "FlagIcon",
  },
  urgent: {
    label: "Urgent",
    color: "text-error",
    icon: "FlagIcon",
  },
};

interface KanbanCardProps {
  project: Project;
}

export function KanbanCard({ project }: KanbanCardProps) {
  const priority = priorityConfig[project.priority];

  return (
    <div className="kanban-card card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-move border border-base-300">
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm line-clamp-2">{project.name}</h4>
          <span className={`${priority.color}`}>
            <FlagIcon className="h-4 w-4" />
          </span>
        </div>

        {/* Client */}
        {project.client && <p className="text-xs text-base-content/60 mt-1">{project.client}</p>}

        {/* Description */}
        <p className="text-xs text-base-content/70 mt-2 line-clamp-2">{project.description}</p>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-base-content/60">Progress</span>
            <span className="text-xs font-medium">{project.progress}%</span>
          </div>
          <progress
            className="progress progress-primary w-full h-1.5"
            value={project.progress}
            max="100"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-300">
          {/* Team Avatars */}
          {project.team && project.team.length > 0 && (
            <div className="avatar-group -space-x-3">
              {project.team.slice(0, 3).map((member, index) => (
                <div
                  key={member._id || `${member.name}-${index}`}
                  className="avatar border-2 border-base-100"
                >
                  <div className="w-6">
                    <Image src={member.imageUrl || ""} alt={member.name} width={24} height={24} />
                  </div>
                </div>
              ))}
              {project.team.length > 3 && (
                <div className="avatar placeholder border-2 border-base-100">
                  <div className="w-6 bg-base-300">
                    <span className="text-[9px]">+{project.team.length - 3}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Deadline */}
          {project.endDate && (
            <div className="flex items-center gap-1 text-xs text-base-content/60">
              <CalendarIcon className="h-3 w-3" />
              <span>
                {new Date(project.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

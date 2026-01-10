import Image from "next/image";
import type { Project } from "@/types/project";

const priorityConfig = {
  low: {
    label: "Low",
    color: "text-base-content/60",
    icon: "lucide--flag",
  },
  medium: {
    label: "Medium",
    color: "text-info",
    icon: "lucide--flag",
  },
  high: {
    label: "High",
    color: "text-warning",
    icon: "lucide--flag",
  },
  urgent: {
    label: "Urgent",
    color: "text-error",
    icon: "lucide--flag",
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
            <span className={`iconify ${priority.icon} size-4`} />
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

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {project.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="badge badge-xs badge-ghost">
                {tag}
              </span>
            ))}
            {project.tags.length > 2 && (
              <span className="badge badge-xs badge-ghost">+{project.tags.length - 2}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-300">
          {/* Team Avatars */}
          {project.team && project.team.length > 0 && (
            <div className="avatar-group -space-x-3">
              {project.team.slice(0, 3).map((member) => (
                <div
                  key={member.imageUrl || member.name}
                  className="avatar border-2 border-base-100"
                >
                  <div className="w-6">
                    <Image
                      src={member.imageUrl || "/default-avatar.png"}
                      alt={member.name}
                      width={24}
                      height={24}
                    />
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
              <span className="iconify lucide--calendar size-3" />
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

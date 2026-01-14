import Image from "next/image";
import { FlagIcon, FolderIcon, LockIcon, UserIcon } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  assignedUser: {
    _id: string;
    name: string;
    imageUrl?: string;
  } | null;
  project: {
    _id: string;
    name: string;
  } | null;
  dueDate?: number;
  isPrivate?: boolean;
}

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

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const isOverdue = task.dueDate && task.dueDate < Date.now();

  return (
    <div className="kanban-card card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-move border border-base-300">
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {task.isPrivate && (
              <span
                className="text-warning flex-shrink-0"
                title="Private Task"
                aria-label="Private Task"
              >
                <LockIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            )}
            <h4 className="font-semibold text-sm line-clamp-2 flex-1">{task.title}</h4>
          </div>
          <span className={`${priority.color} flex-shrink-0`} title={`Priority: ${priority.label}`}>
            <span className={`iconify ${priority.icon} size-4`} aria-hidden="true" />
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-base-content/70 mt-2 line-clamp-2">{task.description}</p>

        {/* Project Badge */}
        {task.project && (
          <div className="mt-2">
            <span className="badge badge-sm badge-ghost">
              <FolderIcon className="h-3 w-3 mr-1" aria-hidden="true" />
              {task.project.name}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-300">
          {/* Assigned User */}
          {task.assignedUser ? (
            <div className="avatar" title={`Assigned to ${task.assignedUser.name}`}>
              <div className="w-6 rounded-full">
                <Image
                  src={task.assignedUser.imageUrl || "/default-avatar.png"}
                  alt={task.assignedUser.name}
                  width={24}
                  height={24}
                />
              </div>
            </div>
          ) : (
            <div className="avatar placeholder" title="Unassigned">
              <div className="w-6 rounded-full bg-base-300">
                <UserIcon className="h-3 w-3" aria-hidden="true" />
              </div>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 text-xs ${
                isOverdue ? "text-error font-medium" : "text-base-content/60"
              }`}
              aria-label={`Due date: ${new Date(task.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
            >
              <span
                className={`${isOverdue ? "AlertCircleIcon" : "CalendarIcon"} size-3`}
                aria-hidden="true"
              />
              <span>
                {new Date(task.dueDate).toLocaleDateString("en-US", {
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

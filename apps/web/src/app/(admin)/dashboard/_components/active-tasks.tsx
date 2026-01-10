import Image from "next/image";

export interface Task {
  id: string;
  name: string;
  status: "planning" | "in-progress";
  priority: "low" | "medium" | "high" | "urgent";
  team: Array<{
    id: string;
    name: string;
    imageUrl: string;
  }>;
}

interface ActiveTasksProps {
  tasks: Task[];
}

const priorityConfig = {
  low: { color: "badge-ghost", label: "Low" },
  medium: { color: "badge-info", label: "Medium" },
  high: { color: "badge-warning", label: "High" },
  urgent: { color: "badge-error", label: "Urgent" },
};

const statusConfig = {
  planning: { color: "text-base-content/60", icon: "lucide--lightbulb" },
  "in-progress": { color: "text-primary", icon: "lucide--zap" },
};

export function ActiveTasks({ tasks }: ActiveTasksProps) {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-lg">Active Tasks</h2>
          <a
            href="/kanban"
            className="btn btn-ghost btn-sm flex items-center"
            aria-label="View Kanban board"
          >
            View Kanban
            <span className="iconify lucide--arrow-right size-4 ml-1" aria-hidden="true" />
          </a>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => {
            const priority = priorityConfig[task.priority];
            const status = statusConfig[task.status];

            return (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-base-300 hover:bg-base-200/50 transition-colors"
              >
                <span className={`iconify ${status.icon} size-5 ${status.color}`} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge badge-xs ${priority.color}`}>{priority.label}</span>
                    <span className="text-xs text-base-content/60 capitalize">
                      {task.status.replace("-", " ")}
                    </span>
                  </div>
                </div>

                {task.team.length > 0 && (
                  <div className="avatar-group -space-x-2">
                    {task.team.slice(0, 2).map((member) => (
                      <div key={member.imageUrl} className="avatar border-2 border-base-100">
                        <div className="w-6">
                          <Image src={member.imageUrl} alt={member.name} width={24} height={24} />
                        </div>
                      </div>
                    ))}
                    {task.team.length > 2 && (
                      <div className="avatar placeholder border-2 border-base-100">
                        <div className="w-6 bg-base-300">
                          <span className="text-[9px]">+{task.team.length - 2}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8">
            <span className="iconify lucide--layout-kanban size-12 text-base-content/20" />
            <p className="text-sm text-base-content/60 mt-2">No active tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}

import type { Project, ProjectStatus } from "@/types/project";
import { KanbanCard } from "./kanban-card";

interface Column {
  id: ProjectStatus;
  title: string;
  projects: Project[];
}

interface KanbanColumnProps {
  column: Column;
}

const statusColors: Record<ProjectStatus, string> = {
  planning: "border-info",
  "in-progress": "border-primary",
  completed: "border-success",
};

const statusBadgeColors: Record<ProjectStatus, string> = {
  planning: "badge-info",
  "in-progress": "badge-primary",
  completed: "badge-success",
};

export function KanbanColumn({ column }: KanbanColumnProps) {
  return (
    <div
      className={`flex flex-col min-w-[320px] max-w-[320px] bg-base-200 rounded-lg border-t-4 ${statusColors[column.id]}`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{column.title}</h3>
          <span className={`badge ${statusBadgeColors[column.id]} badge-sm`}>
            {column.projects.length}
          </span>
        </div>
      </div>

      {/* Column Content - Droppable area */}
      <div
        className="kanban-column-content flex-1 p-4 space-y-3 overflow-y-auto min-h-[200px]"
        data-column-id={column.id}
      >
        {column.projects.map((project) => (
          <KanbanCard key={project.id} project={project} />
        ))}

        {column.projects.length === 0 && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-base-300 rounded-lg text-base-content/40">
            <p className="text-sm">No projects</p>
          </div>
        )}
      </div>
    </div>
  );
}

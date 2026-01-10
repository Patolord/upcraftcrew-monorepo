import { Button } from "@/components/ui/button";
import type { ProjectStatus } from "@/types/project";

interface ProjectsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ProjectStatus | "all";
  setStatusFilter: (status: ProjectStatus | "all") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function ProjectsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
}: ProjectsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label className="input input-bordered flex items-center gap-2">
          <span className="iconify lucide--search size-4 text-base-content/60" />
          <input
            type="text"
            className="grow"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </div>
      <select
        className="select select-bordered w-full sm:w-48"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
      >
        <option value="all">All Status</option>
        <option value="planning">Planning</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <div className="join">
        <Button
          className={`btn text-white join-item ${viewMode === "grid" ? "btn-active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          <span className="iconify lucide--layout-grid size-4" />
        </Button>
        <Button
          className={`btn text-white join-item ${viewMode === "list" ? "btn-active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          <span className="iconify lucide--list size-4" />
        </Button>
      </div>
    </div>
  );
}

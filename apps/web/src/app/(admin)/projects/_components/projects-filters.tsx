import { Button } from "@/components/ui/button";
import type { ProjectStatus } from "@/types/project";
import { LayoutGridIcon, ListIcon, SearchIcon } from "lucide-react";

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
        <label className="input input-bordered h-8 flex items-center gap-2 border border-orange-500 rounded-md">
          <SearchIcon className="text-orange-500 h-4 w-4 ml-2" />
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
        className="select select-bordered w-full sm:w-48 border border-orange-500 rounded-md"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
      >
        <option value="all">Status</option>
        <option value="planning">Planning</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <div className="join">
        <Button
          className={`btn text-orange-500 bg-white border border-orange-500 rounded-md join-item ${viewMode === "grid" ? "btn-active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          <LayoutGridIcon className="h-4 w-4" />
        </Button>
        <Button
          className={`btn text-orange-500 bg-white border border-orange-500 rounded-md join-item ${viewMode === "list" ? "btn-active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          <ListIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

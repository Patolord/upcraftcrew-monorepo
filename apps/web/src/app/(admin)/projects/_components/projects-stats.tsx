import type { Project } from "@/types/project";

interface ProjectsStatsProps {
  projects: Project[];
}

export function ProjectsStats({ projects }: ProjectsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4  gap-6">
      <div className="stats shadow border border-orange-500 rounded-md">
        <div className="stat text-center py-4">
          <div className="stat-title text-xs">Total Projects</div>
          <div className="stat-value text-2xl">{projects.length}</div>
        </div>
      </div>
      <div className="stats shadow border border-orange-500 rounded-md">
        <div className="stat text-center py-4">
          <div className="stat-title text-xs">In Progress</div>
          <div className="stat-value text-2xl text-primary">
            {projects.filter((p) => p.status === "in-progress").length}
          </div>
        </div>
      </div>
      <div className="stats shadow border border-orange-500 rounded-md">
        <div className="stat text-center py-4">
          <div className="stat-title text-xs">Completed</div>
          <div className="stat-value text-2xl text-success">
            {projects.filter((p) => p.status === "completed").length}
          </div>
        </div>
      </div>
      <div className="stats shadow border border-orange-500 rounded-md">
        <div className="stat text-center py-4">
          <div className="stat-title text-xs">Planning</div>
          <div className="stat-value text-2xl text-info">
            {projects.filter((p) => p.status === "planning").length}
          </div>
        </div>
      </div>
    </div>
  );
}

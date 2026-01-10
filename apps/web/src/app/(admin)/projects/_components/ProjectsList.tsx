import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

interface ProjectsListProps {
  projects: Project[];
  viewMode: "grid" | "list";
}

export function ProjectsList({ projects, viewMode }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="iconify lucide--folder-search size-16 text-base-content/20 mb-4" />
        <h3 className="text-lg font-medium mb-2">No projects found</h3>
        <p className="text-base-content/60 text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"
      }
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

import Image from "next/image";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  name: string;
  status: "in-progress" | "completed" | "planning";
  progress: number;
  team?: Array<{
    _id: Id<"users">;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  }>;
}

interface DashboardProjectsOverviewProps {
  projects: Project[];
}

export function DashboardProjectsOverview({ projects }: DashboardProjectsOverviewProps) {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-lg">Project Status</h2>
          <a
            href="/projects"
            className="btn btn-ghost btn-sm flex items-center"
            aria-label="View all projects"
          >
            View All
            <span className="iconify lucide--arrow-right size-4 ml-1" aria-hidden="true" />
          </a>
        </div>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project._id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {project.team && project.team.length > 0 && (
                    <div className="avatar-group -space-x-3">
                      {project.team.slice(0, 3).map((member) => (
                        <div key={member._id} className="avatar border-2 border-base-100">
                          <div className="w-6">
                            {member.imageUrl ? (
                              <Image
                                src={member.imageUrl}
                                alt={`${member.firstName} ${member.lastName}`}
                                width={24}
                                height={24}
                              />
                            ) : (
                              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                                <span className="text-[10px] font-medium text-primary">
                                  {member.firstName?.[0]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <span className="text-sm font-medium truncate">{project.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-base-content/60">
                    {project.status === "in-progress"
                      ? "In Progress"
                      : project.status === "completed"
                        ? "Completed"
                        : project.status === "planning"
                          ? "Planning"
                          : ""}
                  </span>
                  <span className="text-sm font-medium min-w-[3rem] text-right">
                    {project.progress}%
                  </span>
                </div>
              </div>
              <progress
                className="progress progress-primary w-full"
                value={project.progress}
                max="100"
              />
            </div>
          ))}
        </div>
        {projects.length === 0 && (
          <div className="text-center py-8">
            <span className="iconify lucide--folder-kanban size-12 text-base-content/20" />
            <p className="text-sm text-base-content/60 mt-2">No active projects</p>
          </div>
        )}
      </div>
    </div>
  );
}

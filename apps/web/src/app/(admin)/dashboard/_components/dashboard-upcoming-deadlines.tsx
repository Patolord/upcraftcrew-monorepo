import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  name: string;
  endDate: number;
}

interface DashboardUpcomingDeadlinesProps {
  projects: Project[];
}

export function DashboardUpcomingDeadlines({ projects }: DashboardUpcomingDeadlinesProps) {
  return (
    <div className="card pt-4 bg-base-100">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-lg text-orange-500">Upcoming Deadlines</h2>
          <a
            href="/schedule"
            className="btn btn-ghost btn-sm flex items-center"
            aria-label="View full schedule"
          >
            <span className="iconify lucide--calendar size-4" aria-hidden="true" />
          </a>
        </div>
        <div className="space-y-3">
          {projects.map((project) => {
            const daysUntil = Math.ceil((project.endDate - Date.now()) / (1000 * 60 * 60 * 24));
            const isUrgent = daysUntil <= 3;

            return (
              <div
                key={project._id}
                className="flex items-start justify-between gap-3 pb-3 border-b border-base-300 last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{project.name}</p>
                  <p className="text-xs text-base-content/60 mt-1">
                    {new Date(project.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`badge ${isUrgent ? "badge-error" : "badge-warning"} badge-sm flex-shrink-0`}
                >
                  {daysUntil}d
                </span>
              </div>
            );
          })}
        </div>
        {projects.length === 0 && (
          <div className="text-center py-8">
            <span className="iconify lucide--calendar-check size-12 text-base-content/20" />
            <p className="text-sm text-base-content/60 mt-2">No upcoming deadlines</p>
          </div>
        )}
      </div>
    </div>
  );
}

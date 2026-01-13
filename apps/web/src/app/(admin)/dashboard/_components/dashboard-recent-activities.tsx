"use client";

import Image from "next/image";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Activity {
  _id: Id<"tasks">;
  title: string;
  updatedAt: number;
  assignedUser?: {
    _id: Id<"users">;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  } | null;
  project?: {
    _id: Id<"projects">;
    name: string;
  } | null;
}

interface DashboardRecentActivitiesProps {
  activities: Activity[];
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export function DashboardRecentActivities({ activities }: DashboardRecentActivitiesProps) {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-lg">Recent Activities</h2>
        </div>

        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-center gap-3 pb-4 border-b border-base-300 last:border-0 last:pb-0"
            >
              {/* Avatar */}
              <div className="avatar">
                <div className="w-8 h-8 rounded-full bg-base-200">
                  {activity.assignedUser?.imageUrl ? (
                    <Image
                      src={activity.assignedUser.imageUrl}
                      alt={`${activity.assignedUser.firstName} ${activity.assignedUser.lastName}`}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {activity.assignedUser?.firstName?.[0] || "?"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">
                    {activity.assignedUser ? `${activity.assignedUser.firstName}` : "Someone"}
                  </span>{" "}
                  completed task in{" "}
                  <span className="font-medium">{activity.project?.name || "Unknown Project"}</span>
                </p>
                <p className="text-xs text-base-content/60 mt-0.5">
                  {formatTimeAgo(activity.updatedAt)}
                </p>
              </div>

              {/* Status Badge */}
              <span className="badge badge-success badge-sm">success</span>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <span className="iconify lucide--activity size-12 text-base-content/20" />
            <p className="text-sm text-base-content/60 mt-2">No recent activities</p>
          </div>
        )}

        {activities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-base-300">
            <a
              href="/kanban"
              className="btn btn-ghost btn-sm w-full flex items-center justify-center gap-2"
            >
              View All Activity
              <span className="iconify lucide--arrow-right size-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

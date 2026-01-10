import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

export interface Activity {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  time: string;
  type: "success" | "info" | "warning" | "primary";
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h2 className="card-title text-lg mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-4 border-b border-base-300 last:border-0 last:pb-0"
            >
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <Image
                    src={activity.user.avatar || "/placeholder-avatar.png"}
                    alt={activity.user.name}
                    width={40}
                    height={40}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-base-content/60">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-base-content/60 mt-1">{activity.time}</p>
              </div>
              <span className={`badge badge-${activity.type} badge-sm flex-shrink-0`}>
                {activity.type}
              </span>
            </div>
          ))}
        </div>
        <div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
          <a href="/team" className="btn btn-ghost btn-sm">
            View All Activity
            <span className="iconify lucide--arrow-right size-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

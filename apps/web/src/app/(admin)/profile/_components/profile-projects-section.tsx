"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface TeamMember {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  imageUrl?: string;
}

interface Project {
  _id: Id<"projects">;
  name: string;
  client?: string;
  description: string;
  status: "planning" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  progress: number;
  team: (TeamMember | null)[];
  manager: TeamMember | null;
}

interface ProfileProjectsSectionProps {
  projects: Project[];
}

export function ProfileProjectsSection({ projects }: ProfileProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Projects</h2>
        </div>
        <Link
          href="/projects"
          className="text-sm text-orange-500 hover:text-orange-600 font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.slice(0, 4).map((project) => (
          <Card
            key={project._id}
            className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Project color banner */}
            <div className="h-32 bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-16 rounded-full bg-white/50 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-500">
                    {project.name.charAt(0)}
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {project.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Team avatars and view link */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex -space-x-2">
                  {project.team
                    .filter((m): m is TeamMember => m !== null)
                    .slice(0, 4)
                    .map((member, index) => (
                      <Avatar
                        key={member._id}
                        className="size-8 ring-2 ring-white"
                        style={{ zIndex: 4 - index }}
                      >
                        <AvatarImage src={member.imageUrl} alt={member.name} />
                        <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
                          {member.firstName?.charAt(0)}
                          {member.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  {project.team.filter((m) => m !== null).length > 4 && (
                    <div className="size-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-xs font-medium text-muted-foreground">
                      +{project.team.filter((m) => m !== null).length - 4}
                    </div>
                  )}
                </div>

                <Link
                  href={`/projects/${project._id}`}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  View project
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

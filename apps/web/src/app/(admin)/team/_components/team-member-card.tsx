import { Button } from "@/components/ui/button";
import Image from "next/image";

import { roleConfig, statusConfig } from "./team-config";
import { Doc } from "zod/v4/core";

type TeamMemberWithProjects = Doc<"users"> & {
  projects: (Doc<"projects"> | null)[];
};

interface TeamMemberCardProps {
  member: TeamMemberWithProjects;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const role = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.member;
  const status = statusConfig[member.status];

  return (
    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow">
      <div className="card-body">
        {/* Header with Avatar */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <Image
                  src={member.avatar || "/placeholder-avatar.png"}
                  alt={member.name}
                  width={28}
                  height={28}
                />
              </div>
            </div>
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 ${status.color} rounded-full border-2 border-base-100`}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <p className="text-sm text-base-content/60">{member.department}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`badge ${role.color} badge-sm`}>{role.label}</span>
              <span className={`text-xs ${status.textColor}`}>{status.label}</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="iconify lucide--mail size-4 text-base-content/60" />
            <span className="text-base-content/70">{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="iconify lucide--calendar size-4 text-base-content/60" />
            <span className="text-base-content/70">
              Joined {new Date(member.joinedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-base-300">
          <div className="text-center">
            <p className="text-lg font-semibold">{member.projects.length}</p>
            <p className="text-xs text-base-content/60">Projects</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{member.skills.length}</p>
            <p className="text-xs text-base-content/60">Skills</p>
          </div>
        </div>

        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-base-content/60 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">
              {member.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="badge badge-sm badge-outline">
                  {skill}
                </span>
              ))}
              {member.skills.length > 4 && (
                <span className="badge badge-sm badge-ghost">+{member.skills.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="card-actions justify-end mt-4">
          <Button className="btn btn-ghost btn-sm">
            <span className="iconify lucide--message-circle size-4" />
            Message
          </Button>
          <Button className="btn btn-ghost btn-sm">
            <span className="iconify lucide--user size-4" />
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

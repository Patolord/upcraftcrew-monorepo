import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import Image from "next/image";
import { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { roleConfig, statusConfig } from "./team-config";
import { MessageCircleIcon, UserIcon, MoreHorizontalIcon } from "lucide-react";

type TeamMemberWithProjects = Doc<"users"> & {
  projects: (Doc<"projects"> | null)[];
};

interface TeamMemberRowProps {
  member: TeamMemberWithProjects;
}

export function TeamMemberRow({ member }: TeamMemberRowProps) {
  const role = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.member;
  const status =
    statusConfig[(member.status || "offline") as keyof typeof statusConfig] || statusConfig.offline;
  const fullName = `${member.firstName} ${member.lastName}`;

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <Image
                  src={member.imageUrl || "/placeholder-avatar.png"}
                  alt={fullName}
                  width={28}
                  height={28}
                />
              </div>
            </div>
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 ${status.color} rounded-full border-2 border-base-100`}
            />
          </div>
          <div>
            <div className="font-medium">{fullName}</div>
            <div className="text-sm text-base-content/60">
              {member.department || "No department"}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{member.email}</div>
        <div className="text-xs text-base-content/60">
          {member.skills && member.skills.length > 0 ? (
            <>
              {member.skills.slice(0, 2).join(", ")}
              {member.skills.length > 2 && ` +${member.skills.length - 2}`}
            </>
          ) : (
            "No skills"
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className={`badge ${role.color} badge-sm`}>{role.label}</span>
      </TableCell>
      <TableCell>
        <span className={`text-sm ${status.textColor}`}>{status.label}</span>
      </TableCell>
      <TableCell className="text-center">
        <div className="text-sm font-medium">{member.projects.length}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button className="btn btn-ghost btn-xs">
            <MessageCircleIcon className="h-4 w-4" />
          </Button>
          <Button className="btn btn-ghost btn-xs">
            <UserIcon className="h-4 w-4" />
          </Button>
          <Button className="btn btn-ghost btn-xs">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

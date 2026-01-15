import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";

import { roleConfig, statusConfig } from "./team-config";
import { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { MailIcon, UserIcon, CalendarIcon, MessageCircleIcon } from "lucide-react";

type TeamMemberWithProjects = Doc<"users"> & {
  projects: (Doc<"projects"> | null)[];
};

interface TeamMemberCardProps {
  member: TeamMemberWithProjects;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const role = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.member;
  const status =
    statusConfig[(member.status || "offline") as keyof typeof statusConfig] || statusConfig.offline;
  const fullName = `${member.firstName || ""} ${member.lastName || ""}`;

  return (
    <Card className="hover:shadow-lg transition-shadow rounded-lg">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={member.imageUrl || "/placeholder-avatar.png"}
                alt={fullName}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 ${status.color} rounded-full border-2 border-card`}
            />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{fullName}</CardTitle>
            <CardDescription>{member.department || "No department"}</CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <span className={`badge ${role.color} badge-sm`}>{role.label}</span>
              <span className={`text-xs ${status.textColor}`}>{status.label}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MailIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Joined {new Date(member.joinedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
          <div className="text-center">
            <p className="text-lg font-semibold">{member.projects.length}</p>
            <p className="text-xs text-muted-foreground">Projects</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{member.skills?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Skills</p>
          </div>
        </div>

        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">
              {member.skills.slice(0, 4).map((skill: string) => (
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
      </CardContent>

      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" size="sm">
          <MessageCircleIcon className="h-4 w-4" />
          Message
        </Button>
        <Button variant="ghost" size="sm">
          <UserIcon className="h-4 w-4" />
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}

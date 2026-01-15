"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { roleConfig, statusConfig } from "./team-config";
import { Mail, MessageCircle, Phone, Video, Calendar, MapPin, Briefcase } from "lucide-react";

type TeamMemberWithProjects = Doc<"users"> & {
  projects: (Doc<"projects"> | null)[];
};

interface UserDetailPanelProps {
  member: TeamMemberWithProjects | null;
}

export function UserDetailPanel({ member }: UserDetailPanelProps) {
  if (!member) {
    return (
      <Card className="h-fit">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Select a user to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${member.firstName} ${member.lastName}`;
  const role = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.member;
  const status =
    statusConfig[(member.status || "offline") as keyof typeof statusConfig] || statusConfig.offline;
  const userInitials = `${member.firstName?.charAt(0) || ""}${member.lastName?.charAt(0) || ""}`;

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar className="size-24">
              <AvatarImage src={member.imageUrl} alt={fullName} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-400 to-pink-500 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute bottom-1 right-1 size-5 ${status.color} rounded-full border-4 border-card`}
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{fullName}</h3>
            <Badge variant={role.variant}>{role.label}</Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full size-11 bg-orange-50 hover:bg-orange-100 border-0 dark:bg-orange-950/30"
          >
            <MessageCircle className="size-5 text-orange-500" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full size-11 bg-amber-50 hover:bg-amber-100 border-0 dark:bg-amber-950/30"
          >
            <Phone className="size-5 text-amber-500" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full size-11 bg-pink-50 hover:bg-pink-100 border-0 dark:bg-pink-950/30"
          >
            <Video className="size-5 text-pink-500" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full size-11 bg-purple-50 hover:bg-purple-100 border-0 dark:bg-purple-950/30"
          >
            <Mail className="size-5 text-purple-500" />
          </Button>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 space-y-6">
        {/* About Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">About</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hi, I'm {member.firstName} {status.label === "Online" ? "and I'm currently online" : ""}
            .{member.department && ` I work in the ${member.department} department.`}
            {member.projects.length > 0 &&
              ` Currently working on ${member.projects.length} project${member.projects.length !== 1 ? "s" : ""}.`}
          </p>
        </div>

        <Separator />

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="text-muted-foreground mt-0.5">
              <Calendar className="size-4" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="text-sm font-medium">
                {member.joinedAt
                  ? `${Math.floor((Date.now() - member.joinedAt) / (365 * 24 * 60 * 60 * 1000))} years`
                  : "N/A"}
              </p>
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="text-sm font-medium">N/A</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-muted-foreground mt-0.5">
              <Calendar className="size-4" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-xs text-muted-foreground">Date of birth</p>
              <p className="text-sm font-medium">
                {member.joinedAt
                  ? new Date(member.joinedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-muted-foreground mt-0.5">
              <Mail className="size-4" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium break-all">{member.email}</p>
            </div>
          </div>

          {member.department && (
            <div className="flex items-start gap-3">
              <div className="text-muted-foreground mt-0.5">
                <Briefcase className="size-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="text-sm font-medium">{member.department}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="text-muted-foreground mt-0.5">
              <MapPin className="size-4" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-medium">N/A</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Projects */}
        {member.projects.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">Projects</h4>
              <div className="space-y-2">
                {member.projects.slice(0, 3).map((project) => (
                  <div
                    key={project?._id}
                    className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50"
                  >
                    <span className="font-medium">{project?.name || "Unnamed Project"}</span>
                    <Badge variant="outline" className="text-xs">
                      {project?.status || "unknown"}
                    </Badge>
                  </div>
                ))}
                {member.projects.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{member.projects.length - 3} more projects
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

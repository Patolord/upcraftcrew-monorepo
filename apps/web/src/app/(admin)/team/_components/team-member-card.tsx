"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { EyeIcon, MailIcon, PhoneIcon } from "lucide-react";
import React from "react";

type TeamMemberWithProjects = Doc<"users"> & {
  projects: (Doc<"projects"> | null)[];
};

const roleConfig = {
  admin: {
    label: "Admin",
    variant: "default" as const,
  },
  member: {
    label: "Member",
    variant: "secondary" as const,
  },
  viewer: {
    label: "Viewer",
    variant: "outline" as const,
  },
};

const statusConfig = {
  online: {
    label: "Online",
    color: "bg-emerald-500",
  },
  offline: {
    label: "Offline",
    color: "bg-gray-400",
  },
  away: {
    label: "Away",
    color: "bg-amber-500",
  },
  busy: {
    label: "Busy",
    color: "bg-red-500",
  },
};

interface TeamMemberCardProps {
  member: TeamMemberWithProjects;
  onSelect: (member: TeamMemberWithProjects) => void;
}

export function TeamMemberCard({ member, onSelect }: TeamMemberCardProps) {
  const role = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.member;
  const status = statusConfig[member.status as keyof typeof statusConfig] || statusConfig.offline;
  const fullName = `${member.firstName} ${member.lastName}`;
  const initials =
    `${member.firstName?.charAt(0) || ""}${member.lastName?.charAt(0) || ""}`.toUpperCase();

  return (
    <Card className="border border-border rounded-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={member.imageUrl} alt={fullName} />
                <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${status.color}`}
              />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{fullName}</CardTitle>
              <CardDescription className="mt-1">
                {member.department || "No Department"}
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <Badge variant={role.variant}>{role.label}</Badge>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MailIcon className="h-4 w-4" />
            <span className="truncate">{member.email}</span>
          </div>
          {member.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PhoneIcon className="h-4 w-4" />
              <span>{member.phone}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">
              {member.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {member.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{member.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Projects Count */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Projects</p>
            <p className="text-sm font-medium">
              {member.projects?.filter((p) => p !== null).length || 0} active
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Joined</p>
            <p className="text-sm font-medium">
              {new Date(member.joinedAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="justify-end">
        <Button
          onClick={() => onSelect(member)}
          className="bg-orange-500 text-white rounded-md text-xs"
        >
          <EyeIcon className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

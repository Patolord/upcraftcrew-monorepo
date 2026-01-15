import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { roleConfig, statusConfig } from "./team-config";
import { cn } from "@/lib/utils";

type TeamMemberWithProjects = Doc<"users"> & {
  projects: (Doc<"projects"> | null)[];
};

interface TeamMemberRowProps {
  member: TeamMemberWithProjects;
  isSelected?: boolean;
  onSelect?: (member: TeamMemberWithProjects) => void;
}

export function TeamMemberRow({ member, isSelected, onSelect }: TeamMemberRowProps) {
  const role = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.member;
  const status =
    statusConfig[(member.status || "offline") as keyof typeof statusConfig] || statusConfig.offline;
  const fullName = `${member.firstName} ${member.lastName}`;
  const userInitials = `${member.firstName?.charAt(0) || ""}${member.lastName?.charAt(0) || ""}`;

  return (
    <TableRow
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted/50",
        isSelected &&
          "bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-50/70 dark:hover:bg-orange-950/30",
      )}
      onClick={() => onSelect?.(member)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage src={member.imageUrl} alt={fullName} />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-500 text-white text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute bottom-0 right-0 size-3 ${status.color} rounded-full border-2 border-background`}
            />
          </div>
          <div>
            <div className="font-medium">{fullName}</div>
            <div className="text-sm text-muted-foreground">{member.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm font-mono text-muted-foreground">{member._id.slice(0, 8)}...</div>
      </TableCell>
      <TableCell>
        <Badge variant={role.variant}>{role.label}</Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm">{member.department || "N/A"}</div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{member.email.split("@")[1]?.split(".")[0] || "N/A"}</div>
      </TableCell>
    </TableRow>
  );
}

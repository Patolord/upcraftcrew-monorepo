import { View, Text } from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { colors } from "@/lib/colors";

interface TeamMember {
  _id: Id<"users">;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  role: "admin" | "member" | "viewer";
  status: "online" | "offline" | "away" | "busy";
}

interface DashboardTeamOverviewProps {
  teamMembers: TeamMember[];
}

function TeamMemberRow({ member }: { member: TeamMember }) {
  const fullName = `${member.firstName || ""} ${member.lastName || ""}`.trim();
  const initials =
    fullName
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2) || "?";

  const statusColor = {
    online: colors.status.online,
    offline: colors.status.offline,
    away: colors.status.away,
    busy: colors.status.busy,
  }[member.status];

  return (
    <View className="flex-row items-center py-3 border-b border-border last:border-b-0">
      {/* Avatar with status indicator */}
      <View className="relative">
        <Avatar size="default">
          <AvatarImage src={member.imageUrl} alt={fullName} />
          <AvatarFallback className="bg-brand/10">
            <Text className="text-brand font-semibold text-xs">{initials}</Text>
          </AvatarFallback>
        </Avatar>
        {/* Status indicator */}
        <View
          className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-card"
          style={{ backgroundColor: statusColor }}
        />
      </View>

      {/* Member info */}
      <View className="flex-1 ml-3">
        <Text className="text-sm font-semibold text-foreground">{fullName}</Text>
        <Text className="text-xs text-muted-foreground capitalize">{member.role}</Text>
      </View>
    </View>
  );
}

export function DashboardTeamOverview({ teamMembers }: DashboardTeamOverviewProps) {
  const visibleMembers = teamMembers.slice(0, 5);

  return (
    <Card className="rounded-xl bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Equipe</CardTitle>
      </CardHeader>
      <CardContent>
        {visibleMembers.length > 0 ? (
          visibleMembers.map((member) => <TeamMemberRow key={member._id} member={member} />)
        ) : (
          <View className="py-8 items-center">
            <Text className="text-sm text-muted-foreground">Nenhum membro encontrado</Text>
          </View>
        )}
      </CardContent>
    </Card>
  );
}

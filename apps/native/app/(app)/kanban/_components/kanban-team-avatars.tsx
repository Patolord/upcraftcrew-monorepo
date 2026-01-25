import { View, Text } from "react-native";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TeamMember {
  _id: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

interface KanbanTeamAvatarsProps {
  teamMembers: TeamMember[];
  maxVisible?: number;
}

export function KanbanTeamAvatars({ teamMembers, maxVisible = 5 }: KanbanTeamAvatarsProps) {
  const visibleMembers = teamMembers.slice(0, maxVisible);
  const remainingCount = teamMembers.length - maxVisible;

  return (
    <View className="flex-row items-center gap-4">
      <Text className="text-base font-semibold text-foreground">Membros da Equipe</Text>
      <View className="flex-row -space-x-2">
        {visibleMembers.map((member) => {
          const fullName = `${member.firstName || ""} ${member.lastName || ""}`.trim();
          const initials = fullName
            ? fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "U";

          return (
            <Avatar key={member._id} size="default" className="border-2 border-card">
              <AvatarImage src={member.imageUrl} alt={fullName} />
              <AvatarFallback className="bg-brand">
                <Text className="text-xs font-medium text-white">{initials}</Text>
              </AvatarFallback>
            </Avatar>
          );
        })}
        {remainingCount > 0 && (
          <Avatar size="default" className="border-2 border-card">
            <AvatarFallback className="bg-muted">
              <Text className="text-xs text-muted-foreground">+{remainingCount}</Text>
            </AvatarFallback>
          </Avatar>
        )}
      </View>
    </View>
  );
}

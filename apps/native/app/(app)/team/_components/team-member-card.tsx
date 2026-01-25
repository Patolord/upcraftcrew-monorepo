import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { colors } from "@/lib/colors";

interface Project {
  _id?: string;
  name?: string;
}

interface TeamMember {
  _id: Id<"users">;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  role: "admin" | "member" | "viewer";
  department?: string;
  status: "online" | "offline" | "away" | "busy";
  skills?: string[];
  phone?: string;
  joinedAt: number;
  projects?: (Project | null)[];
}

interface TeamMemberCardProps {
  member: TeamMember;
  onSelect?: (member: TeamMember) => void;
}

const roleConfig = {
  admin: {
    label: "Admin",
    variant: "default" as const,
  },
  member: {
    label: "Membro",
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
    color: colors.status.online,
  },
  offline: {
    label: "Offline",
    color: colors.status.offline,
  },
  away: {
    label: "Away",
    color: colors.status.away,
  },
  busy: {
    label: "Busy",
    color: colors.status.busy,
  },
};

export function TeamMemberCard({ member, onSelect }: TeamMemberCardProps) {
  const role = roleConfig[member.role] || roleConfig.member;
  const status = statusConfig[member.status] || statusConfig.offline;
  const fullName = `${member.firstName} ${member.lastName}`;
  const initials =
    `${member.firstName?.charAt(0) || ""}${member.lastName?.charAt(0) || ""}`.toUpperCase();

  return (
    <Card className="rounded-xl bg-card shadow-sm border border-border">
      <CardHeader className="pb-2">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-row items-center gap-3 flex-1">
            {/* Avatar with status indicator */}
            <View className="relative">
              <Avatar size="lg">
                <AvatarImage src={member.imageUrl} alt={fullName} />
                <AvatarFallback>
                  <Text className="text-sm font-medium text-muted-foreground">{initials}</Text>
                </AvatarFallback>
              </Avatar>
              <View
                className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card"
                style={{ backgroundColor: status.color }}
              />
            </View>

            {/* Name and Department */}
            <View className="flex-1">
              <CardTitle className="text-base">{fullName}</CardTitle>
              <CardDescription className="mt-0.5">
                {member.department || "Sem Departamento"}
              </CardDescription>
            </View>
          </View>
          <Badge variant={role.variant}>{role.label}</Badge>
        </View>
      </CardHeader>

      <CardContent className="py-2">
        {/* Contact Info */}
        <View className="space-y-1.5">
          <View className="flex-row items-center gap-2">
            <Ionicons name="mail-outline" size={14} color="#9ca3af" />
            <Text className="text-xs text-muted-foreground flex-1" numberOfLines={1}>
              {member.email}
            </Text>
          </View>
          {member.phone && (
            <View className="flex-row items-center gap-2">
              <Ionicons name="call-outline" size={14} color="#9ca3af" />
              <Text className="text-xs text-muted-foreground">{member.phone}</Text>
            </View>
          )}
        </View>

        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <View className="mt-3">
            <Text className="text-xs text-muted-foreground mb-1.5">Skills</Text>
            <View className="flex-row flex-wrap gap-1">
              {member.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="px-2 py-0.5">
                  <Text className="text-xs">{skill}</Text>
                </Badge>
              ))}
              {member.skills.length > 3 && (
                <Badge variant="secondary" className="px-2 py-0.5">
                  <Text className="text-xs">+{member.skills.length - 3}</Text>
                </Badge>
              )}
            </View>
          </View>
        )}

        {/* Projects Count & Joined */}
        <View className="flex-row gap-4 mt-3">
          <View className="flex-1">
            <Text className="text-xs text-muted-foreground mb-0.5">Projetos</Text>
            <Text className="text-sm font-medium text-foreground">
              {member.projects?.filter((p) => p !== null).length || 0} ativos
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted-foreground mb-0.5">Entrou em</Text>
            <Text className="text-sm font-medium text-foreground">
              {new Date(member.joinedAt).toLocaleDateString("pt-BR", {
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
      </CardContent>

      <CardFooter className="justify-end pt-2">
        <Button variant="default" size="sm" onPress={() => onSelect?.(member)} className="bg-brand">
          <View className="flex-row items-center gap-1">
            <Ionicons name="eye-outline" size={14} color="#ffffff" />
            <Text className="text-white text-xs font-medium">Ver Detalhes</Text>
          </View>
        </Button>
      </CardFooter>
    </Card>
  );
}

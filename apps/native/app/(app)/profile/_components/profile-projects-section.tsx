import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

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
  const router = useRouter();

  if (projects.length === 0) return null;

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-foreground">Projetos</Text>
        <TouchableOpacity onPress={() => router.push("/(app)/projects" as any)}>
          <Text className="text-sm text-brand font-medium">Ver todos →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {projects.slice(0, 4).map((project) => {
          const teamMembers = project.team.filter((m): m is TeamMember => m !== null);
          return (
            <TouchableOpacity
              key={project._id}
              onPress={() => router.push("/(app)/projects" as any)}
              activeOpacity={0.8}
              className="w-64"
            >
              <Card className="rounded-2xl border-0 shadow-sm bg-card overflow-hidden">
                {/* Project color banner */}
                <View className="h-24 bg-orange-50 items-center justify-center">
                  <View className="h-14 w-14 rounded-full bg-white/70 items-center justify-center">
                    <Text className="text-2xl font-bold text-brand">
                      {project.name.charAt(0)}
                    </Text>
                  </View>
                </View>

                <CardContent className="p-4 gap-3">
                  <View>
                    <Text className="font-semibold text-foreground" numberOfLines={1}>
                      {project.name}
                    </Text>
                    <Text className="text-sm text-muted-foreground mt-1" numberOfLines={2}>
                      {project.description}
                    </Text>
                  </View>

                  {/* Progress */}
                  <View className="gap-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-xs text-muted-foreground">Progresso</Text>
                      <Text className="text-xs font-medium text-foreground">{project.progress}%</Text>
                    </View>
                    <Progress value={project.progress} className="h-1.5" />
                  </View>

                  {/* Team avatars */}
                  <View className="flex-row items-center justify-between pt-1">
                    <View className="flex-row" style={{ marginLeft: -4 }}>
                      {teamMembers.slice(0, 4).map((member, index) => (
                        <Avatar
                          key={member._id}
                          size="sm"
                          className="border-2 border-card"
                          style={{ marginLeft: index > 0 ? -8 : 0, zIndex: 4 - index }}
                        >
                          <AvatarImage src={member.imageUrl} alt={member.name} />
                          <AvatarFallback className="bg-orange-100">
                            <Text className="text-orange-600 text-[8px] font-medium">
                              {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                            </Text>
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {teamMembers.length > 4 && (
                        <View
                          className="h-6 w-6 rounded-full bg-gray-100 border-2 border-card items-center justify-center"
                          style={{ marginLeft: -8 }}
                        >
                          <Text className="text-[8px] font-medium text-muted-foreground">
                            +{teamMembers.length - 4}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-xs text-brand font-medium">Ver projeto</Text>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

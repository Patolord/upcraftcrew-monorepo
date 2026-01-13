import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NewTeamMemberModal } from "@/components/modals/NewTeamMemberModal";

export default function TeamPage() {
  const teamMembers = useQuery(api.team.getTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);

  const filteredMembers = useMemo(() => {
    if (!teamMembers) return [];

    return teamMembers.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [teamMembers, searchQuery, roleFilter]);

  const stats = useMemo(() => {
    if (!teamMembers) return { total: 0, online: 0, departments: 0, avgProjects: 0 };

    const departments = new Set(teamMembers.map((m) => m.department).filter(Boolean));
    const totalProjects = teamMembers.reduce((sum, m) => sum + (m.projects?.length || 0), 0);

    return {
      total: teamMembers.length,
      online: teamMembers.filter((m) => m.status === "online").length,
      departments: departments.size,
      avgProjects: teamMembers.length > 0 ? Math.round(totalProjects / teamMembers.length) : 0,
    };
  }, [teamMembers]);

  if (teamMembers === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white pt-10">
        <ActivityIndicator size="large" color="#FF5722" />
        <Text className="mt-4 text-gray-600">Loading team...</Text>
      </View>
    );
  }

  const roleOptions = [
    { label: "All", value: "all" },
    { label: "Owner", value: "owner" },
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Developer", value: "developer" },
    { label: "Designer", value: "designer" },
    { label: "Member", value: "member" },
  ];

  return (
    <View className="flex-1 bg-gray-50 pt-16">
      <ScrollView className="flex-1">
        <View className="space-y-4 p-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="pb-4 font-bold text-3xl text-orange-500">Team</Text>
            <TouchableOpacity
              onPress={() => setIsNewMemberModalOpen(true)}
              className="rounded-lg bg-orange-500 px-4 py-2"
            >
              <Text className="font-semibold text-white">+ Add Member</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row flex-wrap gap-3">
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Total Members</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">{stats.total}</Text>
            </View>

            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Avg Projects</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">{stats.avgProjects}</Text>
            </View>
          </View>

          {/* Search */}
          <View className="mt-4 mb-4 flex-row items-center rounded-lg border border-orange-500 bg-white p-3">
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              className="ml-2 flex-1 text-gray-800"
              placeholder="Search members..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Role Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            contentContainerClassName="gap-3"
          >
            {roleOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setRoleFilter(option.value)}
                className={`rounded-full px-4 py-2 ${
                  roleFilter === option.value
                    ? "bg-orange-500"
                    : "border border-orange-500 bg-white"
                }`}
              >
                <Text
                  className={`font-medium ${
                    roleFilter === option.value ? "text-white" : "text-gray-700"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Team Members List */}
          <View className="gap-4">
            {filteredMembers.map((member) => (
              <View
                key={member._id}
                className="rounded-lg border border-orange-500 bg-white p-4 shadow"
              >
                <View className="flex-row items-start">
                  {/* Avatar */}
                  <View className="relative">
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                      <Text className="font-bold text-lg text-orange-500">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </Text>
                    </View>
                    {/* Status Indicator */}
                    <View
                      className={`absolute right-0 bottom-0 h-4 w-4 rounded-full border-2 border-white ${
                        member.status === "online"
                          ? "bg-green-500"
                          : member.status === "away"
                            ? "bg-yellow-500"
                            : member.status === "busy"
                              ? "bg-red-500"
                              : "bg-gray-300"
                      }`}
                    />
                  </View>

                  {/* Member Info */}
                  <View className="ml-3 flex-1">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-800 text-lg">{member.name}</Text>
                        <Text className="mt-0.5 text-gray-500 text-sm">{member.email}</Text>
                      </View>
                      <View
                        className={`rounded px-2 py-1 ${
                          member.role === "admin"
                            ? "bg-purple-100"
                            : member.role === "member"
                              ? "bg-red-100"
                              : member.role === "viewer"
                                ? "bg-gray-100"
                                : "bg-gray-100"
                        }`}
                      >
                        <Text
                          className={`font-medium text-xs ${
                            member.role === "admin"
                              ? "text-orange-700"
                              : member.role === "member"
                                ? "text-gray-700"
                                : member.role === "viewer"
                                  ? "text-gray-700"
                                  : "text-gray-700"
                          }`}
                        >
                          {member.role}
                        </Text>
                      </View>
                    </View>

                    {/* Department */}
                    <View className="mt-2 flex-row items-center">
                      {member.department && (
                        <>
                          <MaterialCommunityIcons
                            name="office-building-outline"
                            size={14}
                            color="#9ca3af"
                          />
                          <Text className="ml-1 text-gray-600 text-xs">{member.department}</Text>
                        </>
                      )}
                    </View>

                    {/* Stats */}
                    <View className="mt-3 flex-row items-center gap-4">
                      <View className="flex-row items-center">
                        <Ionicons name="briefcase-outline" size={14} color="#9ca3af" />
                        <Text className="ml-1 text-gray-600 text-xs">
                          {member.projects.length || 0} projects
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle-outline" size={14} color="#9ca3af" />
                        <Text className="ml-1 text-gray-600 text-xs">{0 || 0} tasks</Text>
                      </View>
                    </View>

                    {/* Skills */}
                    {member.skills && member.skills.length > 0 && (
                      <View className="mt-3 flex-row flex-wrap gap-1">
                        {member.skills.slice(0, 3).map((skill) => (
                          <View key={skill} className="rounded bg-gray-100 px-2 py-1">
                            <Text className="text-gray-600 text-xs">{skill}</Text>
                          </View>
                        ))}
                        {member.skills.length > 3 && (
                          <View className="rounded bg-gray-100 px-2 py-1">
                            <Text className="text-gray-600 text-xs">
                              +{member.skills.length - 3}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {filteredMembers.length === 0 && (
            <View className="items-center rounded-lg bg-white p-8 shadow">
              <Ionicons name="people-outline" size={48} color="#d1d5db" />
              <Text className="mt-4 text-gray-500">No team members found</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <NewTeamMemberModal
        isOpen={isNewMemberModalOpen}
        onClose={() => setIsNewMemberModalOpen(false)}
      />
    </View>
  );
}

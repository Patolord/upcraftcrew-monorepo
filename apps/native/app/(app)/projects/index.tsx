import { Ionicons } from "@expo/vector-icons";
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
import { NewProjectModal } from "@/components/modals/NewProjectModal";

export default function ProjectsPage() {
  const projects = useQuery(api.projects.getProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    return projects.filter((project) => {
      const matchesSearch =
        searchQuery === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!projects) return { total: 0, active: 0, completed: 0, planning: 0 };

    return {
      total: projects.length,
      active: projects.filter((p) => p.status === "in-progress").length,
      completed: projects.filter((p) => p.status === "completed").length,
      planning: projects.filter((p) => p.status === "planning").length,
    };
  }, [projects]);

  if (projects === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF5722" />
        <Text className="mt-4 text-gray-600">Loading projects...</Text>
      </View>
    );
  }

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Planning", value: "planning" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <View className="flex-1 bg-gray-50 pt-16">
      <ScrollView className="flex-1">
        <View className="space-y-4 p-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="pb-4 font-bold text-3xl text-orange-500">Projects</Text>
            <TouchableOpacity
              onPress={() => setIsNewProjectModalOpen(true)}
              className="rounded-lg bg-orange-500 px-4 py-2"
            >
              <Text className="font-semibold text-white">+ New</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row flex-wrap gap-3">
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Total</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">{stats.total}</Text>
            </View>
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Active</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">{stats.active}</Text>
            </View>
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Completed</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">{stats.completed}</Text>
            </View>
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Planning</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">{stats.planning}</Text>
            </View>
          </View>

          {/* Search */}
          <View className="mt-4 mb-4 flex-row items-center rounded-lg border border-orange-500 bg-white p-3">
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              className="ml-2 flex-1 text-gray-800"
              placeholder="Search projects..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Status Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            contentContainerClassName="gap-3"
          >
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setStatusFilter(option.value)}
                className={`rounded-full px-4 py-2 text-gray-300 ${
                  statusFilter === option.value
                    ? "bg-orange-500"
                    : "border border-orange-500 bg-white"
                }`}
              >
                <Text
                  className={`font-medium ${
                    statusFilter === option.value ? "text-white" : "text-gray-400"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Projects List */}
          <View className="gap-4">
            {filteredProjects.map((project) => (
              <View key={project._id} className="rounded-lg border border-orange-500 bg-white p-4">
                <View className="mb-2 flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800 text-lg">{project.name}</Text>
                    <Text className="mt-1 text-gray-500 text-sm">{project.client}</Text>
                  </View>
                  <View
                    className={`rounded-full px-3 py-1 ${
                      project.status === "completed"
                        ? "bg-orange-100"
                        : project.status === "in-progress"
                          ? "bg-orange-100"
                          : project.status === "planning"
                            ? "bg-orange-100"
                            : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`font-medium text-xs ${
                        project.status === "completed"
                          ? "text-orange-700"
                          : project.status === "in-progress"
                            ? "text-orange-700"
                            : project.status === "planning"
                              ? "text-orange-700"
                              : "text-gray-700"
                      }`}
                    >
                      {project.status}
                    </Text>
                  </View>
                </View>

                {project.description && (
                  <Text className="mb-3 text-gray-600 text-sm" numberOfLines={2}>
                    {project.description}
                  </Text>
                )}

                {/* Progress Bar */}
                <View className="mb-3">
                  <View className="mb-1 flex-row justify-between">
                    <Text className="text-gray-500 text-xs">Progress</Text>
                    <Text className="font-semibold text-orange-500 text-xs">
                      {project.progress}%
                    </Text>
                  </View>
                  <View className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <View
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </View>
                </View>

                {/* Footer */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                    <Text className="ml-1 text-gray-500 text-xs">
                      {new Date(project.startDate).toLocaleDateString()}
                    </Text>
                  </View>
                  {project.budget && (
                    <Text className="font-semibold text-gray-700 text-sm">
                      ${project.budget.spent.toLocaleString()} / $
                      {project.budget.total.toLocaleString()}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {filteredProjects.length === 0 && (
            <View className="items-center rounded-lg bg-white p-8 shadow">
              <Ionicons name="briefcase-outline" size={48} color="#d1d5db" />
              <Text className="mt-4 text-gray-500">No projects found</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </View>
  );
}

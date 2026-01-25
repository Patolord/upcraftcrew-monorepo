import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NewProjectModal } from "@/components/modals/new-project-modal";

import { ProjectHeader } from "./_components/project-header";
import { ProjectsStats } from "./_components/project-stats";
import { ProjectCard } from "./_components/project-card";

const ITEMS_PER_PAGE = 4;

export default function ProjectsPage() {
  const projects = useQuery(api.projects.getProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchQuery.trim()) return projects;

    const query = searchQuery.toLowerCase();
    return projects.filter((project) => {
      return (
        project.name?.toLowerCase().includes(query) ||
        project.client?.toLowerCase().includes(query) ||
        project.status?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );
    });
  }, [projects, searchQuery]);

  // Get visible projects
  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleItems);
  }, [filteredProjects, visibleItems]);

  const canLoadMore = visibleItems < filteredProjects.length;

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + ITEMS_PER_PAGE);
  };

  // Reset visible items when search changes
  useMemo(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [searchQuery]);

  // Loading state
  if (projects === undefined) {
    return (
      <View className="flex-1 bg-admin-background pt-12">
        <View className="px-4 space-y-4">
          {/* Header skeleton */}
          <View className="space-y-4 pb-2">
            <View className="flex-row justify-between">
              <Skeleton className="h-8 w-32" />
              <View className="flex-row items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </View>
            </View>
            <Skeleton className="h-10 w-full rounded-full" />
          </View>

          {/* Stats skeleton */}
          <View className="flex-row flex-wrap gap-3">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="flex-1 min-w-[45%]">
                <Skeleton className="h-20 rounded-xl" />
              </View>
            ))}
          </View>

          {/* Cards skeleton */}
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-admin-background pt-12">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 space-y-4">
          {/* Header */}
          <ProjectHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          {/* Stats */}
          <ProjectsStats projects={projects} />

          {/* Section Header */}
          <View className="flex-row items-center justify-between pt-2">
            <Text className="text-lg font-semibold text-foreground">Nossos Projetos</Text>
            <Button
              variant="default"
              size="sm"
              onPress={() => setIsNewProjectModalOpen(true)}
              className="bg-brand"
            >
              <View className="flex-row items-center gap-1">
                <Ionicons name="add" size={16} color="#ffffff" />
                <Text className="text-white text-xs font-medium">Novo</Text>
              </View>
            </Button>
          </View>

          {/* Projects List */}
          {filteredProjects.length === 0 ? (
            <EmptyState
              icon="folder-open-outline"
              title="Nenhum projeto encontrado"
              description={
                searchQuery
                  ? "Tente ajustar sua busca"
                  : "Crie seu primeiro projeto clicando no botão acima"
              }
            />
          ) : (
            <View className="gap-4">
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onPress={() => {
                    // Navigation to project detail
                  }}
                />
              ))}

              {/* Load More Button */}
              {!searchQuery && canLoadMore && (
                <View className="items-center pt-2">
                  <Button variant="outline" onPress={handleLoadMore} className="min-w-[150px]">
                    <Text className="text-foreground text-sm">Ver Mais</Text>
                  </Button>
                </View>
              )}

              {!searchQuery && !canLoadMore && filteredProjects.length > ITEMS_PER_PAGE && (
                <View className="items-center pt-2">
                  <Text className="text-sm text-muted-foreground">
                    Todos os projetos foram carregados
                  </Text>
                </View>
              )}
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

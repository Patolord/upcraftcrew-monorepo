import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

import { ClientHeader } from "./_components/client-header";
import { ClientCard } from "./_components/client-card";
import { NewClientModal } from "./_components/new-client-modal";

const ITEMS_PER_PAGE = 9;

export default function ClientsPage() {
  const clients = useQuery(api.clients.getClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!searchQuery.trim()) return clients;

    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        (client.company?.toLowerCase().includes(query) ?? false) ||
        (client.email?.toLowerCase().includes(query) ?? false),
    );
  }, [clients, searchQuery]);

  const visibleClients = useMemo(
    () => filteredClients.slice(0, visibleItems),
    [filteredClients, visibleItems],
  );

  const canLoadMore = visibleItems < filteredClients.length;

  useMemo(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [searchQuery]);

  if (clients === undefined) {
    return (
      <View className="flex-1 bg-admin-background pt-12">
        <View className="px-4 gap-4">
          <View className="flex-row justify-between">
            <Skeleton className="h-8 w-24" />
            <View className="flex-row items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </View>
          </View>
          <Skeleton className="h-10 w-full rounded-full" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
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
        <View className="px-4 gap-4">
          <ClientHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          {/* Section header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-foreground">Nossos Clientes</Text>
            <Button
              variant="default"
              size="sm"
              onPress={() => setIsModalOpen(true)}
              className="bg-brand"
            >
              <View className="flex-row items-center gap-1">
                <Ionicons name="add" size={16} color="#ffffff" />
                <Text className="text-white text-xs font-medium">Novo</Text>
              </View>
            </Button>
          </View>

          {/* Client list */}
          {filteredClients.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title="Nenhum cliente encontrado"
              description={
                searchQuery
                  ? "Tente ajustar sua busca"
                  : "Cadastre seu primeiro cliente clicando no botão acima"
              }
            />
          ) : (
            <View className="gap-3">
              {visibleClients.map((client) => (
                <ClientCard key={client._id} client={client} />
              ))}

              {canLoadMore && (
                <View className="items-center pt-2">
                  <Button
                    variant="outline"
                    onPress={() => setVisibleItems((prev) => prev + ITEMS_PER_PAGE)}
                    className="min-w-[150px]"
                  >
                    <Text className="text-foreground text-sm">Carregar mais</Text>
                  </Button>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <NewClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </View>
  );
}

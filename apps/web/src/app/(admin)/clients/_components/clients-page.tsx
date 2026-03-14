"use client";

import { useMemo, useState } from "react";
import { usePreloadedQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Preloaded } from "convex/react";
import { Button } from "@/components/ui/button";
import { ClientCard } from "./client-card";
import { ClientHeader } from "./client-header";
import { NewClientModal } from "./new-client-modal";
import { Building2Icon, Loader2Icon, PlusIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import React from "react";

interface ClientsPageProps {
  preloadedClients: Preloaded<typeof api.clients.getClients>;
}

const ITEMS_PER_PAGE = 9;

export function ClientsPage({ preloadedClients }: ClientsPageProps) {
  const clients = usePreloadedQuery(preloadedClients);

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

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="p-4 md:p-6 md:pl-12 md:pr-12 space-y-4 md:space-y-6">
      <ClientHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">Nossos clientes</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 sm:px-6 text-sm w-full sm:w-auto"
        >
          <PlusIcon className="size-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {!clients ? (
        <div className="flex items-center justify-center py-12">
          <Loader2Icon className="size-6 animate-spin text-orange-500" />
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-card rounded-lg shadow-sm p-4">
          <EmptyState
            icon={Building2Icon}
            title="Nenhum cliente encontrado"
            description={
              searchQuery
                ? "Tente ajustar sua busca"
                : "Cadastre seu primeiro cliente clicando no botão acima"
            }
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleClients.map((client) => (
              <ClientCard key={client._id} client={client} />
            ))}
          </div>

          {canLoadMore && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={handleLoadMore} className="rounded-lg">
                Carregar mais
              </Button>
            </div>
          )}
        </>
      )}

      <NewClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

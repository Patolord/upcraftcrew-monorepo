"use client";

import { useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import React from "react";

interface ClientSelectProps {
  value?: Id<"clients"> | "";
  onValueChange: (value: Id<"clients"> | "") => void;
  placeholder?: string;
  onAddNew?: () => void;
  className?: string;
}

export function ClientSelect({
  value,
  onValueChange,
  placeholder = "Selecione um cliente",
  onAddNew,
  className,
}: ClientSelectProps) {
  const clients = useQuery(api.clients.getClients) ?? [];
  const [search, setSearch] = useState("");

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.company?.toLowerCase().includes(q) ?? false) ||
        (c.email?.toLowerCase().includes(q) ?? false),
    );
  }, [clients, search]);

  const selectedClient = useMemo(() => clients.find((c) => c._id === value), [clients, value]);

  return (
    <Select value={value || null} onValueChange={(v) => onValueChange((v as Id<"clients">) ?? "")}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>{selectedClient?.name ?? placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="border-b px-2 pb-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
        {filteredClients.map((client) => (
          <SelectItem key={client._id} value={client._id}>
            <span className="truncate">
              {client.name}
              {client.company ? ` (${client.company})` : ""}
            </span>
          </SelectItem>
        ))}
        {onAddNew && (
          <>
            <div className="my-1 h-px bg-border" />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onAddNew();
              }}
              className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
            >
              + Cadastrar novo cliente
            </button>
          </>
        )}
      </SelectContent>
    </Select>
  );
}

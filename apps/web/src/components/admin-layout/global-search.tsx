"use client";

import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const typeLabel: Record<"client" | "contract" | "proposal", string> = {
  client: "Cliente",
  contract: "Contrato",
  proposal: "Proposta",
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const normalizedTerm = term.trim();

  const results = useQuery(
    api.clients.searchGlobal,
    normalizedTerm.length >= 2 ? { term: normalizedTerm, limit: 12 } : "skip",
  );

  const isLoading = normalizedTerm.length >= 2 && results === undefined;
  const hasNoResults = normalizedTerm.length >= 2 && results?.length === 0;

  const shortcut = useMemo(
    () => (typeof window !== "undefined" && navigator.platform.includes("Mac") ? "⌘K" : "Ctrl+K"),
    [],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="h-8 w-full justify-between px-2 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <SearchIcon className="size-3.5" />
              Buscar clientes, contratos e propostas
            </span>
            <span className="rounded border px-1.5 py-0.5 text-[10px] font-semibold">
              {shortcut}
            </span>
          </Button>
        }
      />
      <DialogContent className="max-w-[calc(100%-1rem)] p-0 sm:max-w-xl" showCloseButton={false}>
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle className="text-foreground">Busca Global</DialogTitle>
          <DialogDescription>
            Procure por clientes, contratos e propostas em um único lugar.
          </DialogDescription>
        </DialogHeader>

        <div className="border-b p-3">
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Digite pelo menos 2 caracteres..."
            className="h-9"
            autoFocus
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {normalizedTerm.length < 2 && (
            <p className="px-2 py-3 text-xs text-muted-foreground">
              Comece digitando para buscar em clientes, contratos e propostas.
            </p>
          )}

          {isLoading && (
            <p className="px-2 py-3 text-xs text-muted-foreground">Buscando resultados...</p>
          )}

          {hasNoResults && (
            <p className="px-2 py-3 text-xs text-muted-foreground">
              Nenhum resultado encontrado para &quot;{normalizedTerm}&quot;.
            </p>
          )}

          {(results ?? []).map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={result.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between rounded px-2 py-2 transition-colors",
                "hover:bg-muted/70",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{result.title}</p>
                <p className="truncate text-xs text-muted-foreground">{result.subtitle}</p>
              </div>
              <Badge variant="outline" className="ml-2 shrink-0 text-[10px] font-medium">
                {typeLabel[result.type]}
              </Badge>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

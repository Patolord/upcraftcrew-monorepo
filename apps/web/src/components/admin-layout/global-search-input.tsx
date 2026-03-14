"use client";

import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const typeLabel: Record<"client" | "contract" | "proposal", string> = {
  client: "Cliente",
  contract: "Contrato",
  proposal: "Proposta",
};

interface GlobalSearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function GlobalSearchInput({
  value = "",
  onChange,
  placeholder = "Search...",
  className,
}: GlobalSearchInputProps) {
  const [focused, setFocused] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedTerm = value.trim();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedTerm(normalizedTerm);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [normalizedTerm]);

  const results = useQuery(
    api.clients.searchGlobal,
    debouncedTerm.length >= 2 ? { term: debouncedTerm, limit: 12 } : "skip",
  );

  const isLoading =
    normalizedTerm.length >= 2 && (debouncedTerm !== normalizedTerm || results === undefined);
  const hasNoResults =
    debouncedTerm.length >= 2 && debouncedTerm === normalizedTerm && results?.length === 0;
  const showDropdown =
    focused && normalizedTerm.length >= 2 && (isLoading || hasNoResults || (results && results.length > 0));

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setFocused(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={containerRef} className="relative">
      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        className={cn(
          "w-full h-10 md:h-11 pl-5 pr-12 rounded-full bg-white dark:bg-muted/50 border-0 shadow-sm text-sm",
          className,
        )}
      />
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border bg-popover shadow-lg">
          {isLoading && (
            <p className="px-4 py-3 text-xs text-muted-foreground">Buscando resultados...</p>
          )}

          {hasNoResults && (
            <p className="px-4 py-3 text-xs text-muted-foreground">
              Nenhum resultado encontrado para &quot;{normalizedTerm}&quot;.
            </p>
          )}

          {(results ?? []).map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={result.href}
              onClick={() => setFocused(false)}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 transition-colors",
                "hover:bg-muted/70 first:rounded-t-xl last:rounded-b-xl",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{result.title}</p>
                <p className="truncate text-xs text-muted-foreground">{result.subtitle}</p>
              </div>
              <Badge variant="outline" className="ml-3 shrink-0 text-[10px] font-medium">
                {typeLabel[result.type]}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

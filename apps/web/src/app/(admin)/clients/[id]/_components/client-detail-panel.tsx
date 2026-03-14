"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2Icon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  PencilIcon,
  StickyNoteIcon,
} from "lucide-react";
import type { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import React from "react";

interface ClientDetailPanelProps {
  client: Doc<"clients">;
  onEdit?: () => void;
}

export function ClientDetailPanel({ client, onEdit }: ClientDetailPanelProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/50">
            <Building2Icon className="size-8 text-orange-500" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{client.name}</h3>
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="size-8 shrink-0 rounded-full text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                aria-label="Editar cliente"
              >
                <PencilIcon className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {client.email && (
          <div className="flex items-start gap-3">
            <MailIcon className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium break-all">{client.email}</p>
            </div>
          </div>
        )}

        {client.phone && (
          <div className="flex items-start gap-3">
            <PhoneIcon className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Telefone</p>
              <p className="text-sm font-medium">{client.phone}</p>
            </div>
          </div>
        )}

        {client.notes && (
          <div className="flex items-start gap-3">
            <StickyNoteIcon className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Observações</p>
              <p className="text-sm">{client.notes}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <CalendarIcon className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Cadastrado em</p>
            <p className="text-sm font-medium">
              {new Date(client.createdAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

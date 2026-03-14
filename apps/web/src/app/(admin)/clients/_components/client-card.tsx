"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Building2Icon, EyeIcon, MailIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ClientCardProps {
  client: Doc<"clients">;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <Card className="border border-border rounded-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/50">
              <Building2Icon className="size-6 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{client.name}</CardTitle>
              <CardDescription className="mt-1 truncate">
                {client.company || "Sem empresa"}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {client.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
              <MailIcon className="size-4 flex-shrink-0" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PhoneIcon className="size-4 flex-shrink-0" />
              <span>{client.phone}</span>
            </div>
          )}
          {!client.email && !client.phone && (
            <p className="text-sm text-muted-foreground">Sem informações de contato</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Link
          href={`/clients/${client._id}`}
          className={buttonVariants({
            variant: "outline",
            className:
              "bg-orange-500! text-white! border border-orange-600! rounded-xl text-xs hover:bg-orange-600! hover:border-orange-700!",
          })}
        >
          <EyeIcon className="size-4 mr-1" />
          Ver perfil
        </Link>
      </CardFooter>
    </Card>
  );
}

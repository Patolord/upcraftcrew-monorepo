import { type ReactNode } from "react";

import { AppSidebar } from "@/components/admin-layout/sidebar/app-sidebar";
import { Providers } from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { EnsureUserSynced } from "@/components/ensure-user-synced";
import React from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <EnsureUserSynced />
      <SidebarProvider className="bg-admin-background">
        <AppSidebar />
        <SidebarInset className="bg-admin-background">{children}</SidebarInset>
      </SidebarProvider>
    </Providers>
  );
}

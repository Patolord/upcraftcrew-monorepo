import { type ReactNode } from "react";

import { AppSidebar } from "@/components/admin-layout/sidebar/app-sidebar";
import { BottomNav } from "@/components/admin-layout/bottom-nav";
import { Providers } from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { EnsureUserSynced } from "@/components/ensure-user-synced";
import React from "react";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <EnsureUserSynced />
      <SidebarProvider className="bg-admin-background">
        <AppSidebar />
        <SidebarInset className="bg-admin-background pb-20 md:pb-0 overflow-x-hidden">
          {children}
        </SidebarInset>
        <BottomNav />
      </SidebarProvider>
    </Providers>
  );
}

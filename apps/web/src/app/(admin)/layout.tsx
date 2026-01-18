import { type ReactNode } from "react";

import { Footer } from "@/components/admin-layout/Footer";
import { AppSidebar } from "@/components/admin-layout/sidebar/app-sidebar";
import { Providers } from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <SidebarProvider className="bg-admin-background">
        <AppSidebar />
        <SidebarInset className="bg-admin-background">
          {children}
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
}

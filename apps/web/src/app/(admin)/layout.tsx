"use client";

import { type ReactNode } from "react";

import { Footer } from "@/components/admin-layout/Footer";
import { AppSidebar } from "@/components/admin-layout/sidebar/app-sidebar";
import { Providers } from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-auto p-4">{children}</main>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
};

export default Layout;

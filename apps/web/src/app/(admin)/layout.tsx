"use client";

import { type ReactNode } from "react";

import { Footer } from "@/components/admin-layout/Footer";
import { AppSidebar } from "@/components/admin-layout/sidebar/app-sidebar";
import { Providers } from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome back!</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">{children}</main>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
};

export default Layout;

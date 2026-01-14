"use client";

import { type ReactNode } from "react";

import { Footer } from "@/components/admin-layout/Footer";
import { AppSidebar } from "@/components/admin-layout/sidebar/app-sidebar";
import { Providers } from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
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
};

export default Layout;

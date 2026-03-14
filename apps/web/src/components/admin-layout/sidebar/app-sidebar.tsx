"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import NavLogo from "./nav-logo";
import NavMain from "./nav-main";
import NavThird from "./nav-third";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader className="px-4 pt-5 pb-2">
        <NavLogo />
      </SidebarHeader>
      <SidebarSeparator className="opacity-50" />
      <SidebarContent className="py-2">
        <NavMain />
      </SidebarContent>
      <SidebarSeparator className="opacity-50" />
      <SidebarFooter className="pb-6">
        <NavThird />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

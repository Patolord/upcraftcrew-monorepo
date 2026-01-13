"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import NavLogo from "./nav-logo";
import NavMain from "./nav-main";
import NavThird from "./nav-third";
import NavUser from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-2 pt-3 flex-col gap-2">
        <NavLogo />
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavThird />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

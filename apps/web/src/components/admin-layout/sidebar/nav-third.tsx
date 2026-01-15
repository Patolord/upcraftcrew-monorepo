"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { toast } from "sonner";
import React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export default function NavThird() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const handleSignOut = () => {
    toast.success("Logged out successfully");
    router.push("/");
    setOpenMobile(false);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SignOutButton>
          <SidebarMenuButton
            onClick={handleSignOut}
            tooltip="Logout"
            className="text-sidebar-accent hover:bg-sidebar-accent/10 hover:text-sidebar-accent group-data-[collapsible=icon]:justify-center"
          >
            <LogOut className="size-5 text-sidebar-accent" />
            <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">Logout</span>
          </SidebarMenuButton>
        </SignOutButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

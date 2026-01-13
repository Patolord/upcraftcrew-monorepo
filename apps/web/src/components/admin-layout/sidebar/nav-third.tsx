"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { toast } from "sonner";

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
            tooltip="Sign out"
            className="hover:bg-white/10 group-data-[collapsible=icon]:justify-center"
          >
            <LogOut className="size-4" />
            <span className="text-sm group-data-[collapsible=icon]:hidden">Sign out</span>
          </SidebarMenuButton>
        </SignOutButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

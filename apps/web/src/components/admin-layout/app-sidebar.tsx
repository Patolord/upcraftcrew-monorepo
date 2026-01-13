"use client";

import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  CalendarDays,
  DollarSign,
  Kanban,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Budgets", url: "/budgets", icon: FileText },
  { title: "Projects", url: "/projects", icon: FolderOpen },
  { title: "Team", url: "/team", icon: Users },
  { title: "Schedule", url: "/schedule", icon: CalendarDays },
  { title: "Finance", url: "/finance", icon: DollarSign },
  { title: "Kanban", url: "/kanban", icon: Kanban },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const handleSignOut = () => {
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2 pt-3 flex-col gap-2">
        <div className="flex items-center justify-end w-full -mt-1">
          <SidebarTrigger className="text-orange-500 hover:text-orange-600 hover:bg-orange-500/10" />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
                  />
                }
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/20 text-sidebar-foreground shrink-0">
                  {user?.firstName?.charAt(0) ||
                    user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">{user?.firstName || "User"}</span>
                  <span className="truncate text-xs opacity-80">
                    {user?.emailAddresses[0]?.emailAddress || ""}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <SignOutButton>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </SignOutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className="group-data-[collapsible=icon]:justify-center"
                    >
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SignOutButton>
              <SidebarMenuButton
                onClick={handleSignOut}
                tooltip="Sign out"
                className="hover:bg-white/10 group-data-[collapsible=icon]:justify-center"
              >
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
              </SidebarMenuButton>
            </SignOutButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

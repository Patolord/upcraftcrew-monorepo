"use client";

import { ChevronsUpDown, LogOut, Moon, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { toast } from "sonner";
import React from "react";
import { useTheme } from "@/hooks/use-theme";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function NavUser() {
  const router = useRouter();
  const { user } = useUser();
  const { state } = useSidebar();
  const { theme, toggleTheme, mounted } = useTheme();

  const handleSignOut = () => {
    toast.success("Logged out successfully");
    router.push("/");
  };

  const userInitials =
    user?.firstName?.charAt(0) ||
    user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent/10 group-data-[collapsible=icon]:justify-center rounded-xl"
              />
            }
          >
            <Avatar className="size-9 shrink-0">
              <AvatarImage src={user?.imageUrl} alt={user?.firstName || "User"} />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {state === "expanded" && (
              <>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">
                    {user?.firstName || "User"}
                  </span>
                  <span className="truncate text-xs text-sidebar-muted">
                    {user?.emailAddresses[0]?.emailAddress || ""}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-sidebar-muted" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl"
            align="start"
            side="bottom"
            sideOffset={8}
          >
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
              <User className="size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={toggleTheme}>
              {mounted && theme === "dark" ? (
                <>
                  <Sun className="size-4" />
                  Light mode
                </>
              ) : (
                <>
                  <Moon className="size-4" />
                  Dark mode
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

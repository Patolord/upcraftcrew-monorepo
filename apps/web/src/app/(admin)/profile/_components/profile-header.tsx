"use client";

import { ChevronDown, LogOut, Moon, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { toast } from "sonner";
import React from "react";
import { useTheme } from "@/hooks/use-theme";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileHeader() {
  const router = useRouter();
  const { user } = useUser();
  const { theme, toggleTheme, mounted } = useTheme();

  const handleSignOut = () => {
    toast.success("Logged out successfully");
    router.push("/");
  };

  const userInitials =
    user?.firstName?.charAt(0) ||
    user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
    "U";

  const userName = user?.firstName || "User";

  return (
    <header className="flex items-center justify-between py-4 md:py-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-medium text-shadow-sm text-foreground">Profile</h1>
      </div>

      {/* Right side - User */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 md:gap-3 cursor-pointer outline-none">
          <Avatar className="size-9 md:size-10 ring-2 ring-pink-300 ring-offset-2">
            <AvatarImage src={user?.imageUrl} alt={userName} />
            <AvatarFallback className="bg-pink-400 text-white text-sm font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{userName}</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-xl" align="end" sideOffset={8}>
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
    </header>
  );
}

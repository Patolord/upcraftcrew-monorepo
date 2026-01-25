"use client";

import { ChevronDown, LogOut, Moon, Search, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface TeamHeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export function TeamHeader({ searchQuery = "", onSearchChange }: TeamHeaderProps) {
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
    <header className="flex flex-col gap-4 py-4 md:py-6">
      {/* Top row - Title and User */}
      <div className="flex items-center justify-between">
        {/* Left side - Profile Avatar and Title */}
        <div className="flex items-center gap-3">
          <Link href="/profile" className="group"></Link>
          <h1 className="text-2xl md:text-3xl font-medium text-shadow-sm text-foreground">
            All Users
          </h1>
        </div>

        {/* Right side - User */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 md:gap-3 cursor-pointer outline-none">
            <Avatar className="size-9 md:size-10 ring-2 ring-pink-300 ring-offset-2">
              <AvatarImage src={user?.imageUrl} alt={userName} />
              <AvatarFallback className="bg-linear-to-br from-orange-400 to-pink-500 text-white text-sm font-medium">
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
      </div>

      {/* Search - Full width on mobile */}
      <div className="relative w-full md:max-w-md md:mx-auto">
        <Input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full h-10 md:h-11 pl-5 pr-12 rounded-full bg-white dark:bg-muted/50 border-0 shadow-sm text-sm"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
      </div>
    </header>
  );
}

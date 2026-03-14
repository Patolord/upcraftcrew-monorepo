"use client";

import { ChevronDown, LogOut, Moon, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { GlobalSearchInput } from "@/components/admin-layout/global-search-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface ClientHeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export function ClientHeader({ searchQuery = "", onSearchChange }: ClientHeaderProps) {
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-4">
        <h1 className="text-2xl md:text-3xl font-medium text-shadow-sm text-foreground">
          Clientes
        </h1>

        <div className="flex-1 md:max-w-md md:mx-4 order-3 md:order-2">
          <GlobalSearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Buscar clientes..."
          />
        </div>

        <div className="order-2 md:order-3 shrink-0">
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
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={toggleTheme}>
                {mounted && theme === "dark" ? (
                  <>
                    <Sun className="size-4" />
                    Modo claro
                  </>
                ) : (
                  <>
                    <Moon className="size-4" />
                    Modo escuro
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <SignOutButton>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive"
                >
                  <LogOut className="size-4" />
                  Sair
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

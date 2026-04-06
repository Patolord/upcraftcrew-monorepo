"use client";

import { ChevronDown, LogOut, Moon, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { toast } from "sonner";
import React from "react";
import { useTheme } from "@/hooks/use-theme";
import Link from "next/link";

import { GlobalSearchInput } from "@/components/admin-layout/global-search-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CurrencySwitch, type CurrencyCode } from "@/components/ui/currency-switch";

interface FinanceHeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
}

export function FinanceHeader({
  searchQuery = "",
  onSearchChange,
  currency,
  onCurrencyChange,
}: FinanceHeaderProps) {
  const router = useRouter();
  const { user } = useUser();
  const { theme, toggleTheme, mounted } = useTheme();

  const handleSignOut = () => {
    toast.success("Sessão encerrada com sucesso");
    router.push("/");
  };

  const userInitials =
    user?.firstName?.charAt(0) ||
    user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
    "U";

  const userName = user?.firstName || "Usuário";

  return (
    <header className="flex flex-col gap-4 py-4 md:py-6 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6">
      {/* Left side - Title */}
      <div className="flex items-center justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="group"></Link>
          <h1 className="text-2xl md:text-3xl font-medium text-shadow-sm text-foreground">
            Financeiro
          </h1>
        </div>

        {/* User avatar - visible on mobile only in this position */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer outline-none">
              <Avatar className="size-9 ring-2 ring-pink-300 ring-offset-2">
                <AvatarImage src={user?.imageUrl} alt={userName} />
                <AvatarFallback className="bg-pink-400 text-white text-sm font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
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

      {/* Center - Search + Currency Switch */}
      <div className="flex items-center gap-2 justify-center">
        <div className="flex-1 max-w-md">
          <GlobalSearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Buscar..."
          />
        </div>
        <CurrencySwitch value={currency} onChange={onCurrencyChange} />
      </div>

      {/* Right side - User (desktop only) */}
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer outline-none">
            <Avatar className="size-10 ring-2 ring-pink-300 ring-offset-2">
              <AvatarImage src={user?.imageUrl} alt={userName} />
              <AvatarFallback className="bg-pink-400 text-white text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
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
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                <LogOut className="size-4" />
                Sair
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

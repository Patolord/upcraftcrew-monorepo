"use client";

import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  CalendarDays,
  DollarSign,
  Kanban,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orçamentos",
    url: "/budgets",
    icon: FileText,
  },
  {
    title: "Projetos",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Equipe",
    url: "/team",
    icon: Users,
  },
  {
    title: "Agenda",
    url: "/schedule",
    icon: CalendarDays,
  },
  {
    title: "Finanças",
    url: "/finance",
    icon: DollarSign,
  },
  {
    title: "Kanban",
    url: "/kanban",
    icon: Kanban,
  },
  {
    title: "Perfil",
    url: "/profile",
    icon: User,
  },
];

// Items to show in bottom nav (limited to 5 for better UX)
const bottomNavItems = navItems.slice(0, 5);

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/dashboard") return pathname === url;
    return pathname.startsWith(url);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {bottomNavItems.map((item) => {
          const active = isActive(item.url);
          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 px-1 transition-all duration-200",
                active
                  ? "text-orange-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-orange-400",
              )}
            >
              <item.icon
                className={cn(
                  "size-5 mb-1 transition-transform duration-200",
                  active && "scale-110",
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium leading-tight text-center truncate max-w-full",
                  active && "font-semibold",
                )}
              >
                {item.title}
              </span>
              {active && <div className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

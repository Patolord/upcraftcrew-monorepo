"use client";

import {
  LayoutDashboardIcon,
  FileTextIcon,
  FolderOpenIcon,
  KanbanIcon,
  UserIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  UsersIcon,
  MailIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

// Items to show in bottom nav (limited to 5 for better UX)
// Profile is first since it's the main entry point with tasks
const bottomNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Assistente",
    url: "/assistant",
    icon: MailIcon,
  },
  {
    title: "Projetos",
    url: "/projects",
    icon: FolderOpenIcon,
  },
  {
    title: "Clientes",
    url: "/clients",
    icon: UserCircleIcon,
  },
  {
    title: "Kanban",
    url: "/kanban",
    icon: KanbanIcon,
  },
  {
    title: "Perfil",
    url: "/profile",
    icon: UserIcon,
  },
  {
    title: "Agenda",
    url: "/schedule",
    icon: CalendarDaysIcon,
  },

  {
    title: "Equipe",
    url: "/team",
    icon: UsersIcon,
  },
  {
    title: "Orçamentos",
    url: "/budgets",
    icon: FileTextIcon,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/dashboard" || url === "/profile") return pathname === url;
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

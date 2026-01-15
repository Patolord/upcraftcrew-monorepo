"use client";

import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  CalendarDays,
  DollarSign,
  Kanban,
  ChevronDown,
  type LucideIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface SubMenuItem {
  title: string;
  url: string;
}

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  prefetch?: boolean;
  items?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    prefetch: true,
  },
  {
    title: "Budgets",
    url: "/budgets",
    icon: FileText,
    prefetch: true,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
    prefetch: true,
  },
  {
    title: "Team",
    url: "/team",
    icon: Users,
    prefetch: true,
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: CalendarDays,
    prefetch: true,
  },
  {
    title: "Finance",
    url: "/finance",
    icon: DollarSign,
    prefetch: true,
  },
  {
    title: "Kanban",
    url: "/kanban",
    icon: Kanban,
    prefetch: true,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    prefetch: true,
  },
];

export default function NavMain() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const isActive = (url: string) => {
    if (url === "/dashboard") return pathname === url;
    return pathname.startsWith(url);
  };

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {menuItems.map((item) => {
          const active = isActive(item.url);
          const hasSubItems = item.items && item.items.length > 0;
          const isOpen = openMenus.includes(item.title);

          if (hasSubItems) {
            return (
              <Collapsible
                key={item.title}
                open={isOpen || active}
                onOpenChange={() => toggleMenu(item.title)}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={item.title}
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      "justify-between cursor-pointer",
                      active && "bg-sidebar-accent text-sidebar-accent-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-200",
                        (isOpen || active) && "rotate-180",
                      )}
                    />
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.url}>
                          <SidebarMenuSubButton
                            isActive={pathname === subItem.url}
                            render={
                              <Link
                                href={subItem.url}
                                onClick={() => setOpenMobile(false)}
                                prefetch={item.prefetch}
                              />
                            }
                          >
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={active}
                tooltip={item.title}
                render={
                  <Link
                    href={item.url}
                    onClick={() => setOpenMobile(false)}
                    prefetch={item.prefetch}
                  />
                }
                className={cn(active && "bg-sidebar-accent text-sidebar-accent-foreground")}
              >
                <item.icon className="size-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

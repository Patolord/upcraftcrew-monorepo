"use client";

import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  CalendarDays,
  DollarSign,
  Kanban,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  prefetch?: boolean;
}

const items: MenuItem[] = [
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
];

export default function NavMain() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton>
              <Link
                href={item.url}
                className="flex gap-3 py-5"
                onClick={() => setOpenMobile(false)}
                data-sidebar={item.url.replace("/", "")}
                {...(item.prefetch !== undefined && {
                  prefetch: item.prefetch,
                })}
              >
                <item.icon className="size-5" />
                <span className="text-base">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

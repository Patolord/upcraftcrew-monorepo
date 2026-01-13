"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NavLogo() {
  return (
    <div className="flex items-center justify-end w-full -mt-1">
      <SidebarTrigger className="text-orange-500 hover:text-orange-600 hover:bg-orange-500/10" />
    </div>
  );
}

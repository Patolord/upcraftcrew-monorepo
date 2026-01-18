"use client";

import { useSidebar } from "@/components/ui/sidebar";
import React from "react";
import Image from "next/image";

export default function NavLogo() {
  const { state } = useSidebar();

  return (
    <div className="flex items-center gap-2 px-1">
      {/* Logo Icon - Stylized sun/swirl */}
      <div className="flex items-center justify-center size-10 shrink-0">
        <Image src="/logo/logo-light-mini.png" alt="logo" width={100} height={100} />
      </div>

      {/* Brand Name */}
      {state === "expanded" && (
        <span className="text-xl font-semibold text-sidebar-foreground tracking-tight">
          Up Craft Crew
        </span>
      )}
    </div>
  );
}

"use client";

import { MenuIcon } from "lucide-react";

export const NavBar = () => {
  return (
    <div className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-base-300 bg-base-100 px-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <label
          className="btn btn-square btn-ghost btn-sm group-has-[[id=layout-sidebar-hover-trigger]:checked]/html:hidden"
          aria-label="Sidebar toggle"
          htmlFor="layout-sidebar-toggle-trigger"
        >
          <MenuIcon className="size-5" />
        </label>
        <label
          className="btn btn-square btn-ghost btn-sm hidden group-has-[[id=layout-sidebar-hover-trigger]:checked]/html:flex"
          aria-label="Leftmenu toggle"
          htmlFor="layout-sidebar-hover-trigger"
        >
          <MenuIcon className="size-5" />
        </label>
        <div>
          <p className="leading-none font-medium md:text-lg">
            Good Morning<span className="max-sm:hidden">!</span>
          </p>
          <p className="text-base-content/60 mt-1 text-sm/none max-sm:hidden">
            Welcome back, great to see you again!
          </p>
        </div>
      </div>
    </div>
  );
};

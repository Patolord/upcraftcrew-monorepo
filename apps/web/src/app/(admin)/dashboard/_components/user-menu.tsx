"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserMenu() {
  const router = useRouter();

  return (
    <SignOutButton>
      <button
        onClick={() => {
          toast.success("Logged out successfully");
          router.push("/");
        }}
        className="dropdown dropdown-bottom sm:dropdown-end max-sm:dropdown-center"
      >
        {/* Add your menu content here */}
      </button>
    </SignOutButton>
  );
}

"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserMenu() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return <div className="dropdown dropdown-bottom sm:dropdown-end max-sm:dropdown-center"></div>;
}

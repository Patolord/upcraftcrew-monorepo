"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { useEnsureCurrentUser } from "@/hooks/use-ensure-current-user";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexReactClient(convexUrl);

function AuthSync({ children }: { children: ReactNode }) {
  useEnsureCurrentUser();
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <AuthSync>{children}</AuthSync>
    </ConvexProviderWithClerk>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";

/**
 * Hook to ensure the current user exists in Convex database.
 * This hook handles the synchronization between Clerk auth and Convex users.
 *
 * Should be used in client components that need to ensure user exists before queries.
 * Runs only once per sign-in to avoid unnecessary mutations.
 */
export function useEnsureCurrentUser() {
  const { isSignedIn, isLoaded } = useAuth();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const hasEnsuredRef = useRef(false);

  useEffect(() => {
    // Only run once per session when user is signed in
    if (isLoaded && isSignedIn && !hasEnsuredRef.current) {
      hasEnsuredRef.current = true;
      ensureCurrentUser().catch((error) => {
        // Reset flag on error so it can retry next time
        hasEnsuredRef.current = false;
        console.error("Failed to ensure user exists:", error);
      });
    }

    // Reset flag when user signs out
    if (isLoaded && !isSignedIn) {
      hasEnsuredRef.current = false;
    }
  }, [isLoaded, isSignedIn, ensureCurrentUser]);

  return { isLoaded, isSignedIn };
}

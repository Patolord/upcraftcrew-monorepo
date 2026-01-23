"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useEffect, useRef } from "react";

/**
 * Component that ensures the current Clerk user is synced to Convex
 * This is a fallback for when the Clerk webhook hasn't fired yet
 *
 * Usage: Add this component to your root layout or any protected page
 */
export function EnsureUserSynced() {
  const { isLoaded, isSignedIn } = useUser();
  const ensureUser = useMutation(api.users.ensureCurrentUser);
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Only run once per mount
    if (hasRunRef.current) return;

    // Wait for Clerk to load and check if user is signed in
    if (!isLoaded || !isSignedIn) return;

    // Ensure the user exists in Convex
    ensureUser()
      .then(() => {
        console.log("[EnsureUserSynced] User synced to Convex");
        hasRunRef.current = true;
      })
      .catch((error) => {
        console.error("[EnsureUserSynced] Failed to sync user:", error);
        // Don't mark as run so it can retry on next render
      });
  }, [isLoaded, isSignedIn, ensureUser]);

  // This component doesn't render anything
  return null;
}

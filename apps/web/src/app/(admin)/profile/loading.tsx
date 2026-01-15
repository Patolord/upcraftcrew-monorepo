import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function ProfileLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
      </div>

      {/* Profile Card Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}

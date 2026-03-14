import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="p-4 md:p-6 md:pl-12 md:pr-12 space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 py-4 md:py-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

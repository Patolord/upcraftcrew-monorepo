import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function KanbanLoading() {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-24 md:w-32" />
          <Skeleton className="h-4 w-36 md:w-48 mt-2" />
        </div>
        <Skeleton className="h-9 md:h-10 w-24 md:w-32 rounded-full" />
      </div>

      {/* Team Members Skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-16" />
        <div className="flex -space-x-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="size-8 md:size-10 rounded-full" />
          ))}
        </div>
      </div>

      {/* Kanban Board Skeleton */}
      <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-x-visible md:pb-0 scrollbar-hide">
        {[...Array(4)].map((_, colIndex) => (
          <div key={colIndex} className="min-w-[80vw] sm:min-w-[45vw] md:min-w-0 space-y-4">
            <Skeleton className="h-10 w-full rounded-2xl" />
            <div className="space-y-2">
              {[...Array(3)].map((_, cardIndex) => (
                <Skeleton key={cardIndex} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

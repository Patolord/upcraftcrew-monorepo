import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function KanbanLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Kanban Board Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, colIndex) => (
          <div key={colIndex} className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-3">
              {[...Array(3)].map((_, cardIndex) => (
                <Skeleton key={cardIndex} className="h-32 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

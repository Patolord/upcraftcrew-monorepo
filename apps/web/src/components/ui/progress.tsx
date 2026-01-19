"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={value}
        max={max}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <ProgressPrimitive.Track className="h-full w-full">
          <ProgressPrimitive.Indicator
            className="h-full bg-orange-500 transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>
    );
  },
);

Progress.displayName = "Progress";

export { Progress };

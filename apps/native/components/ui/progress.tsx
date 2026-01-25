import * as React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

interface ProgressProps extends ViewProps {
  className?: string;
  value?: number;
  max?: number;
  indicatorClassName?: string;
}

function Progress({
  className,
  value = 0,
  max = 100,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <View
      className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <View
        className={cn("h-full bg-brand rounded-full", indicatorClassName)}
        style={{ width: `${percentage}%` }}
      />
    </View>
  );
}

export { Progress, type ProgressProps };

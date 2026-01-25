import * as React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

interface SeparatorProps extends ViewProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

function Separator({ className, orientation = "horizontal", ...props }: SeparatorProps) {
  return (
    <View
      className={cn(
        "bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator, type SeparatorProps };

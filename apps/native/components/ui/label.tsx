import * as React from "react";
import { Text, type TextProps } from "react-native";
import { cn } from "@/lib/utils";

interface LabelProps extends TextProps {
  className?: string;
  required?: boolean;
}

function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <Text className={cn("text-sm font-medium text-foreground", className)} {...props}>
      {children}
      {required && <Text className="text-destructive"> *</Text>}
    </Text>
  );
}

export { Label, type LabelProps };

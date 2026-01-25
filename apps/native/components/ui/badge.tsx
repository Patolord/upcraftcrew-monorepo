import * as React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "success" | "warning" | "outline";

interface BadgeProps extends ViewProps {
  className?: string;
  textClassName?: string;
  variant?: BadgeVariant;
  children?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, { container: string; text: string }> = {
  default: {
    container: "bg-primary",
    text: "text-primary-foreground",
  },
  secondary: {
    container: "bg-secondary",
    text: "text-secondary-foreground",
  },
  destructive: {
    container: "bg-destructive",
    text: "text-white",
  },
  success: {
    container: "bg-green-500",
    text: "text-white",
  },
  warning: {
    container: "bg-amber-500",
    text: "text-white",
  },
  outline: {
    container: "bg-transparent border border-border",
    text: "text-foreground",
  },
};

function Badge({ className, textClassName, variant = "default", children, ...props }: BadgeProps) {
  const variantStyle = variantStyles[variant];

  return (
    <View
      className={cn(
        "flex-row items-center rounded-full px-2.5 py-0.5",
        variantStyle.container,
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={cn("text-xs font-semibold", variantStyle.text, textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

export { Badge, type BadgeProps, type BadgeVariant };

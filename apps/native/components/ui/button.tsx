import * as React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends TouchableOpacityProps {
  className?: string;
  textClassName?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  default: {
    container: "bg-brand",
    text: "text-brand-foreground",
  },
  outline: {
    container: "border border-border bg-transparent",
    text: "text-foreground",
  },
  secondary: {
    container: "bg-secondary",
    text: "text-secondary-foreground",
  },
  ghost: {
    container: "bg-transparent",
    text: "text-foreground",
  },
  destructive: {
    container: "bg-destructive",
    text: "text-white",
  },
  link: {
    container: "bg-transparent",
    text: "text-brand underline",
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  default: {
    container: "h-10 px-4 py-2",
    text: "text-sm",
  },
  sm: {
    container: "h-8 px-3",
    text: "text-xs",
  },
  lg: {
    container: "h-12 px-6",
    text: "text-base",
  },
  icon: {
    container: "h-10 w-10",
    text: "text-sm",
  },
};

function Button({
  className,
  textClassName,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      className={cn(
        "flex-row items-center justify-center rounded-lg",
        variantStyle.container,
        sizeStyle.container,
        disabled && "opacity-50",
        className,
      )}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === "default" ? "#ffffff" : "#ff8e29"} />
      ) : typeof children === "string" ? (
        <Text className={cn("font-medium", variantStyle.text, sizeStyle.text, textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };

import * as React from "react";
import { View, Image, Text, type ViewProps, type ImageProps } from "react-native";
import { cn } from "@/lib/utils";

interface AvatarProps extends ViewProps {
  className?: string;
  size?: "sm" | "default" | "lg" | "xl";
}

const sizeStyles = {
  sm: "h-6 w-6",
  default: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

function Avatar({ className, size = "default", ...props }: AvatarProps) {
  return (
    <View
      className={cn("relative overflow-hidden rounded-full", sizeStyles[size], className)}
      {...props}
    />
  );
}

interface AvatarImageProps extends Omit<ImageProps, "source"> {
  className?: string;
  src?: string;
  alt?: string;
}

function AvatarImage({ className, src, alt, ...props }: AvatarImageProps) {
  const [hasError, setHasError] = React.useState(false);

  if (!src || hasError) {
    return null;
  }

  return (
    <Image
      source={{ uri: src }}
      className={cn("h-full w-full", className)}
      onError={() => setHasError(true)}
      accessibilityLabel={alt}
      {...props}
    />
  );
}

interface AvatarFallbackProps extends ViewProps {
  className?: string;
  children?: React.ReactNode;
}

function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  return (
    <View
      className={cn(
        "absolute inset-0 flex items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className="text-xs font-medium text-muted-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export { Avatar, AvatarImage, AvatarFallback, type AvatarProps };

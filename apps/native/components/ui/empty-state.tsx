import * as React from "react";
import { View, Text, type ViewProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends ViewProps {
  className?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

function EmptyState({
  className,
  icon = "folder-open-outline",
  iconSize = 48,
  title = "Nenhum item encontrado",
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <View className={cn("items-center justify-center py-12 px-4", className)} {...props}>
      <View className="items-center justify-center rounded-full bg-muted p-4 mb-4">
        <Ionicons name={icon} size={iconSize} color="#9ca3af" />
      </View>
      <Text className="text-lg font-semibold text-foreground text-center mb-1">{title}</Text>
      {description && (
        <Text className="text-sm text-muted-foreground text-center max-w-xs">{description}</Text>
      )}
      {action && <View className="mt-4">{action}</View>}
    </View>
  );
}

export { EmptyState, type EmptyStateProps };

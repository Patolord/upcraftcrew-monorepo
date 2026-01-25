import * as React from "react";
import { TextInput, View, Text, type TextInputProps, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

interface InputProps extends TextInputProps {
  className?: string;
  containerClassName?: string;
  label?: string;
  error?: string;
}

function Input({ className, containerClassName, label, error, ...props }: InputProps) {
  return (
    <View className={cn("w-full", containerClassName)}>
      {label && <Text className="mb-1.5 text-sm font-medium text-foreground">{label}</Text>}
      <TextInput
        className={cn(
          "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground",
          error && "border-destructive",
          className,
        )}
        placeholderTextColor="#737373"
        {...props}
      />
      {error && <Text className="mt-1 text-xs text-destructive">{error}</Text>}
    </View>
  );
}

export { Input, type InputProps };

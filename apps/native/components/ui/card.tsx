import * as React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import { cn } from "@/lib/utils";

interface CardProps extends ViewProps {
  className?: string;
}

function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn("rounded-xl border border-border bg-card p-4 shadow-sm", className)}
      {...props}
    />
  );
}

interface CardHeaderProps extends ViewProps {
  className?: string;
}

function CardHeader({ className, ...props }: CardHeaderProps) {
  return <View className={cn("flex-col gap-1.5 pb-2", className)} {...props} />;
}

interface CardTitleProps extends TextProps {
  className?: string;
}

function CardTitle({ className, ...props }: CardTitleProps) {
  return <Text className={cn("text-lg font-semibold text-foreground", className)} {...props} />;
}

interface CardDescriptionProps extends TextProps {
  className?: string;
}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <Text className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

interface CardContentProps extends ViewProps {
  className?: string;
}

function CardContent({ className, children, ...props }: CardContentProps) {
  const content = React.Children.map(children, (child, index) => {
    if (typeof child === "string") {
      if (child.trim() === "") return null;
      return (
        <Text key={`card-content-text-${index}`} className="text-foreground">
          {child}
        </Text>
      );
    }
    if (typeof child === "number") {
      return (
        <Text key={`card-content-text-${index}`} className="text-foreground">
          {child}
        </Text>
      );
    }
    return child;
  });

  return (
    <View className={cn("py-2", className)} {...props}>
      {content}
    </View>
  );
}

interface CardFooterProps extends ViewProps {
  className?: string;
}

function CardFooter({ className, ...props }: CardFooterProps) {
  return <View className={cn("flex-row items-center pt-2", className)} {...props} />;
}

interface CardActionProps extends ViewProps {
  className?: string;
}

function CardAction({ className, ...props }: CardActionProps) {
  return <View className={cn("ml-auto", className)} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };

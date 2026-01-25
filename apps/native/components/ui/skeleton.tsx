import * as React from "react";
import { View, type ViewProps, Animated, Easing } from "react-native";
import { cn } from "@/lib/utils";

interface SkeletonProps extends ViewProps {
  className?: string;
}

function Skeleton({ className, ...props }: SkeletonProps) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      className={cn("rounded-md bg-muted", className)}
      style={{ opacity }}
      {...props}
    />
  );
}

export { Skeleton, type SkeletonProps };

import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading while checking auth status
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  // Redirect to dashboard if authenticated, otherwise to sign-in
  if (isSignedIn) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Redirect href="/sign-in" />;
}

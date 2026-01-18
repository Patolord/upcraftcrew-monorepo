import { Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
  return (
    <View className="flex-1 bg-gray-50">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f9fafb" },
        }}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>
    </View>
  );
}

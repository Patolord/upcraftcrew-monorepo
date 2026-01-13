import { Platform } from "react-native";
import { NAV_THEME } from "@/lib/constants";

export async function setAndroidNavigationBar(theme: "light" | "dark") {
  if (Platform.OS !== "android") return;

  try {
    const NavigationBar = await import("expo-navigation-bar");
    await NavigationBar.setButtonStyleAsync(theme === "dark" ? "light" : "dark");
    await NavigationBar.setBackgroundColorAsync(
      theme === "dark" ? NAV_THEME.dark.background : NAV_THEME.light.background,
    );
  } catch (error) {
    // expo-navigation-bar not available in Expo Go
    console.warn("expo-navigation-bar not available:", error);
  }
}

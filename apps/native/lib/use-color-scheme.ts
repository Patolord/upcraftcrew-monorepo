import { useColorScheme as useRNColorScheme } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLOR_SCHEME_KEY = "@color_scheme";

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const [colorScheme, setColorSchemeState] = useState<"light" | "dark">(
    systemColorScheme === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    AsyncStorage.getItem(COLOR_SCHEME_KEY).then((stored) => {
      if (stored) {
        setColorSchemeState(stored as "light" | "dark");
      }
    });
  }, []);

  const isDarkColorScheme = colorScheme === "dark";

  const setColorScheme = async (scheme: "light" | "dark") => {
    setColorSchemeState(scheme);
    await AsyncStorage.setItem(COLOR_SCHEME_KEY, scheme);
  };

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  return {
    colorScheme,
    isDarkColorScheme,
    setColorScheme,
    toggleColorScheme,
  };
}

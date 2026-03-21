import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import { SidebarMenu } from "./sidebar-menu";

export function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  const isProfileActive = pathname.startsWith("/profile");
  const isAssistantActive = pathname.startsWith("/assistant");

  return (
    <>
      <View className="bg-card border-t border-border" style={{ paddingBottom: insets.bottom }}>
        <View className="flex-row items-center justify-around h-16">
          {/* Menu */}
          <TouchableOpacity
            onPress={() => setMenuOpen(true)}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center py-2"
          >
            <Ionicons name="menu-outline" size={24} color="#737373" />
            <Text className="text-[10px] mt-1 font-medium text-muted-foreground">Menu</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            onPress={() => router.push("/(app)/profile" as any)}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center py-2"
          >
            <Ionicons
              name={isProfileActive ? "person" : "person-outline"}
              size={24}
              color={isProfileActive ? "#ff8e29" : "#737373"}
            />
            <Text
              className={cn(
                "text-[10px] mt-1 font-medium",
                isProfileActive ? "text-brand" : "text-muted-foreground",
              )}
            >
              Perfil
            </Text>
            {isProfileActive && (
              <View className="absolute bottom-1 w-1 h-1 rounded-full bg-brand" />
            )}
          </TouchableOpacity>

          {/* Assistant */}
          <TouchableOpacity
            onPress={() => router.push("/(app)/assistant" as any)}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center py-2"
          >
            <Ionicons
              name={isAssistantActive ? "mail" : "mail-outline"}
              size={24}
              color={isAssistantActive ? "#ff8e29" : "#737373"}
            />
            <Text
              className={cn(
                "text-[10px] mt-1 font-medium",
                isAssistantActive ? "text-brand" : "text-muted-foreground",
              )}
            >
              Assistente
            </Text>
            {isAssistantActive && (
              <View className="absolute bottom-1 w-1 h-1 rounded-full bg-brand" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <SidebarMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

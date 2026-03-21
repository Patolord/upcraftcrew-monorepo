import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface NavItem {
  title: string;
  route: string;
  icon: string;
  iconFamily: "ionicons" | "material-community";
}

const navItems: NavItem[] = [
  { title: "Dashboard", route: "/(app)/dashboard", icon: "grid-outline", iconFamily: "ionicons" },
  {
    title: "Projetos",
    route: "/(app)/projects",
    icon: "briefcase-outline",
    iconFamily: "ionicons",
  },
  {
    title: "Clientes",
    route: "/(app)/clients",
    icon: "people-circle-outline",
    iconFamily: "ionicons",
  },
  { title: "Equipe", route: "/(app)/team", icon: "people-outline", iconFamily: "ionicons" },
  { title: "Agenda", route: "/(app)/schedule", icon: "calendar-outline", iconFamily: "ionicons" },
  {
    title: "Kanban",
    route: "/(app)/kanban",
    icon: "view-column",
    iconFamily: "material-community",
  },
  { title: "Finanças", route: "/(app)/finance", icon: "cash-outline", iconFamily: "ionicons" },
  {
    title: "Orçamentos",
    route: "/(app)/budgets",
    icon: "document-text-outline",
    iconFamily: "ionicons",
  },
];

interface SidebarMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function SidebarMenu({ visible, onClose }: SidebarMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-Dimensions.get("window").width * 0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(-Dimensions.get("window").width * 0.8);
    }
  }, [visible, slideAnim]);

  const userInitials =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
    "U";
  const userName = user?.firstName || "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  const isActive = (route: string) => {
    const routePath = route.replace("/(app)", "");
    if (routePath === "/dashboard") return pathname === "/dashboard" || pathname === "/";
    return pathname.startsWith(routePath);
  };

  const handleNavigate = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 100);
  };

  const handleSignOut = async () => {
    onClose();
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 flex-row">
        {/* Sidebar */}
        <Animated.View
          style={{
            width: "80%",
            transform: [{ translateX: slideAnim }],
          }}
          className="bg-card h-full"
        >
          <View className="flex-1" style={{ paddingTop: insets.top }}>
            {/* User info */}
            <View className="px-5 py-5 border-b border-border">
              <View className="flex-row items-center gap-3">
                <Avatar size="lg" className="border-2 border-brand">
                  <AvatarImage src={user?.imageUrl} alt={userName} />
                  <AvatarFallback className="bg-brand">
                    <Text className="text-white text-base font-semibold">{userInitials}</Text>
                  </AvatarFallback>
                </Avatar>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">{userName}</Text>
                  <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                    {userEmail}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <Ionicons name="close" size={24} color="#737373" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Nav items */}
            <ScrollView className="flex-1 py-2" showsVerticalScrollIndicator={false}>
              {navItems.map((item) => {
                const active = isActive(item.route);
                return (
                  <TouchableOpacity
                    key={item.route}
                    onPress={() => handleNavigate(item.route)}
                    activeOpacity={0.7}
                    className={cn(
                      "flex-row items-center gap-3 mx-3 px-3 py-3.5 rounded-xl",
                      active ? "bg-brand/10" : "bg-transparent",
                    )}
                  >
                    {item.iconFamily === "ionicons" ? (
                      <Ionicons
                        name={item.icon as any}
                        size={22}
                        color={active ? "#ff8e29" : "#737373"}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={item.icon as any}
                        size={22}
                        color={active ? "#ff8e29" : "#737373"}
                      />
                    )}
                    <Text
                      className={cn(
                        "text-sm font-medium",
                        active ? "text-brand" : "text-foreground",
                      )}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Sign out */}
            <View
              className="border-t border-border px-5 py-4"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              <TouchableOpacity
                onPress={handleSignOut}
                activeOpacity={0.7}
                className="flex-row items-center gap-3"
              >
                <Ionicons name="log-out-outline" size={22} color="#ef4444" />
                <Text className="text-sm font-medium text-destructive">Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Overlay to close */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="flex-1 bg-black/40" />
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

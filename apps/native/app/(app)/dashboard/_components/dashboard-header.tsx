import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function DashboardHeader() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const userInitials =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
    "U";

  const userName = user?.firstName || "User";

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View className="flex-row items-center justify-between pb-4">
      {/* Title */}
      <Text className="text-2xl font-bold text-foreground">Dashboard</Text>

      {/* Right side - User */}
      <View className="flex-row items-center gap-3">
        <View className="flex-row items-center gap-2">
          <Avatar size="default" className="border-2 border-pink-300">
            <AvatarImage src={user?.imageUrl} alt={userName} />
            <AvatarFallback className="bg-pink-400">
              <Text className="text-white text-sm font-medium">{userInitials}</Text>
            </AvatarFallback>
          </Avatar>
          <Text className="text-sm font-medium text-foreground">{userName}</Text>
        </View>
        <TouchableOpacity
          onPress={handleSignOut}
          className="h-10 w-10 items-center justify-center rounded-full bg-muted"
        >
          <Ionicons name="log-out-outline" size={20} color="#ff8e29" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

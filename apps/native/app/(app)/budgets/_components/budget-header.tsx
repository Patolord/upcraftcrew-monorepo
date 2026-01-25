import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface BudgetHeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export function BudgetHeader({ searchQuery = "", onSearchChange }: BudgetHeaderProps) {
  const { user } = useUser();

  const userInitials =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
    "U";

  const userName = user?.firstName || "User";

  return (
    <View className="space-y-4 pb-2">
      {/* Top row: Title and User */}
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">Orçamentos</Text>
        <View className="flex-row items-center gap-2">
          <Avatar size="default" className="border-2 border-pink-300">
            <AvatarImage src={user?.imageUrl} alt={userName} />
            <AvatarFallback className="bg-pink-400">
              <Text className="text-white text-sm font-medium">{userInitials}</Text>
            </AvatarFallback>
          </Avatar>
          <Text className="text-sm font-medium text-foreground">{userName}</Text>
        </View>
      </View>

      {/* Search */}
      <View className="flex-row items-center bg-card rounded-full px-4 py-2 shadow-sm border border-border">
        <Ionicons name="search-outline" size={20} color="#9ca3af" />
        <TextInput
          className="flex-1 ml-2 text-sm text-foreground"
          placeholder="Buscar orçamentos..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
    </View>
  );
}

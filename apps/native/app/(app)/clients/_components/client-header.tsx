import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ClientHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ClientHeader({ searchQuery, onSearchChange }: ClientHeaderProps) {
  const { user } = useUser();
  const { signOut: _signOut } = useAuth();
  const _router = useRouter();

  const userInitials =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
    "U";
  const userName = user?.firstName || "User";

  return (
    <View className="gap-4 pb-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">Clientes</Text>
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
      <View className="flex-row items-center bg-card rounded-full px-4 h-10 border border-border">
        <Ionicons name="search-outline" size={18} color="#737373" />
        <TextInput
          className="flex-1 ml-2 text-sm text-foreground"
          placeholder="Buscar clientes..."
          placeholderTextColor="#737373"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={18}
            color="#737373"
            onPress={() => onSearchChange("")}
          />
        )}
      </View>
    </View>
  );
}

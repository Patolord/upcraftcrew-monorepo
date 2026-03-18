import { useState } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditProfileSheet } from "./edit-profile-sheet";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  phone?: string;
  age?: number;
  location?: string;
  bio?: string;
  role: "admin" | "member" | "viewer";
  department?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

interface ProfileUserCardProps {
  user: User;
}

const roleConfig = {
  admin: { label: "Admin", color: "bg-brand" },
  member: { label: "Member", color: "bg-blue-500" },
  viewer: { label: "Viewer", color: "bg-gray-500" },
};

export function ProfileUserCard({ user }: ProfileUserCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fullName = `${user.firstName} ${user.lastName}`;
  const userInitials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;
  const roleDisplay = roleConfig[user.role];

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <>
      <Card className="rounded-2xl border-0 shadow-sm bg-card">
        <View className="p-5">
          {/* Avatar and basic info */}
          <View className="flex-row items-start gap-4">
            <Avatar size="xl" className="border-4 border-orange-200">
              <AvatarImage src={user.imageUrl ?? ""} alt={fullName} />
              <AvatarFallback className="bg-brand">
                <Text className="text-white text-xl font-semibold">{userInitials}</Text>
              </AvatarFallback>
            </Avatar>
            <View className="flex-1 gap-1">
              <Text className="text-xl font-semibold text-foreground">{fullName}</Text>
              <Text className="text-sm text-muted-foreground">
                {user.department || roleDisplay.label}
              </Text>
              <Badge variant="default" className={`self-start mt-1 ${roleDisplay.color}`}>
                <Text className="text-white text-xs font-medium">{roleDisplay.label}</Text>
              </Badge>
            </View>
          </View>

          {/* Bio */}
          {user.bio && (
            <Text className="mt-4 text-sm text-muted-foreground leading-5">
              {user.bio}
            </Text>
          )}

          {/* Divider */}
          <View className="h-px bg-border my-4" />

          {/* Contact info */}
          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="mail-outline" size={18} color="#ff8e29" />
              <Text className="text-sm text-brand flex-1">{user.email}</Text>
            </View>

            {user.phone && (
              <View className="flex-row items-center gap-3">
                <Ionicons name="call-outline" size={18} color="#737373" />
                <Text className="text-sm text-foreground">{user.phone}</Text>
              </View>
            )}

            {user.age !== undefined && user.age !== null && (
              <View className="flex-row items-center gap-3">
                <Ionicons name="person-outline" size={18} color="#737373" />
                <Text className="text-sm text-foreground">{user.age} anos</Text>
              </View>
            )}

            {user.location && (
              <View className="flex-row items-center gap-3">
                <Ionicons name="location-outline" size={18} color="#737373" />
                <Text className="text-sm text-foreground">{user.location}</Text>
              </View>
            )}

            {/* Social Links */}
            <View className="flex-row items-center gap-3 mt-1">
              <Ionicons name="share-social-outline" size={18} color="#737373" />
              <View className="flex-row items-center gap-2">
                {user.socialLinks?.facebook && (
                  <TouchableOpacity
                    onPress={() => openLink(user.socialLinks!.facebook!)}
                    className="h-8 w-8 rounded-full bg-blue-500 items-center justify-center"
                  >
                    <Ionicons name="logo-facebook" size={16} color="#fff" />
                  </TouchableOpacity>
                )}
                {user.socialLinks?.instagram && (
                  <TouchableOpacity
                    onPress={() => openLink(user.socialLinks!.instagram!)}
                    className="h-8 w-8 rounded-full bg-pink-500 items-center justify-center"
                  >
                    <Ionicons name="logo-instagram" size={16} color="#fff" />
                  </TouchableOpacity>
                )}
                {user.socialLinks?.twitter && (
                  <TouchableOpacity
                    onPress={() => openLink(user.socialLinks!.twitter!)}
                    className="h-8 w-8 rounded-full bg-sky-400 items-center justify-center"
                  >
                    <Ionicons name="logo-twitter" size={16} color="#fff" />
                  </TouchableOpacity>
                )}
                {!user.socialLinks?.facebook &&
                  !user.socialLinks?.instagram &&
                  !user.socialLinks?.twitter && (
                    <Text className="text-sm text-muted-foreground">Não definido</Text>
                  )}
              </View>
            </View>
          </View>

          {/* Edit Button */}
          <View className="items-end mt-4">
            <Button
              onPress={() => setIsEditOpen(true)}
              className="bg-brand rounded-full px-6"
            >
              <Text className="text-white text-sm font-medium">Editar perfil</Text>
            </Button>
          </View>
        </View>
      </Card>

      <EditProfileSheet
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        currentData={{
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          age: user.age,
          location: user.location,
          bio: user.bio,
          socialLinks: user.socialLinks,
        }}
      />
    </>
  );
}

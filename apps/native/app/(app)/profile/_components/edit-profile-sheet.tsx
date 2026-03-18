import { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditProfileSheetProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    firstName: string;
    lastName: string;
    phone?: string;
    age?: number;
    location?: string;
    bio?: string;
    socialLinks?: {
      twitter?: string;
      instagram?: string;
      facebook?: string;
    };
  };
}

export function EditProfileSheet({ open, onClose, currentData }: EditProfileSheetProps) {
  const updateProfile = useMutation(api.users.updateProfile);

  const [formData, setFormData] = useState({
    firstName: currentData.firstName || "",
    lastName: currentData.lastName || "",
    phone: currentData.phone || "",
    age: currentData.age?.toString() || "",
    location: currentData.location || "",
    bio: currentData.bio || "",
    twitter: currentData.socialLinks?.twitter || "",
    instagram: currentData.socialLinks?.instagram || "",
    facebook: currentData.socialLinks?.facebook || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        location: formData.location || undefined,
        bio: formData.bio || undefined,
        socialLinks: {
          twitter: formData.twitter || undefined,
          instagram: formData.instagram || undefined,
          facebook: formData.facebook || undefined,
        },
      });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso");
      onClose();
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar perfil");
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        <SheetHeader onClose={onClose}>
          <SheetTitle>Editar Perfil</SheetTitle>
          <SheetDescription>Atualize suas informações pessoais</SheetDescription>
        </SheetHeader>

        <View className="px-6 gap-4 pb-6">
          {/* Name Fields */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label="Nome"
                value={formData.firstName}
                onChangeText={(v) => updateField("firstName", v)}
                placeholder="Nome"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Sobrenome"
                value={formData.lastName}
                onChangeText={(v) => updateField("lastName", v)}
                placeholder="Sobrenome"
              />
            </View>
          </View>

          {/* Bio */}
          <View>
            <Label className="mb-1.5">Bio</Label>
            <TextInput
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground min-h-[80px]"
              value={formData.bio}
              onChangeText={(v) => updateField("bio", v)}
              placeholder="Conte-nos sobre você..."
              placeholderTextColor="#737373"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Contact */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label="Telefone"
                value={formData.phone}
                onChangeText={(v) => updateField("phone", v)}
                placeholder="+55 (11) 99999-9999"
                keyboardType="phone-pad"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Idade"
                value={formData.age}
                onChangeText={(v) => updateField("age", v)}
                placeholder="27"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Location */}
          <Input
            label="Localização"
            value={formData.location}
            onChangeText={(v) => updateField("location", v)}
            placeholder="São Paulo, BR"
          />

          {/* Social Links */}
          <View>
            <Label className="mb-2">Redes Sociais</Label>
            <View className="gap-3">
              <Input
                value={formData.twitter}
                onChangeText={(v) => updateField("twitter", v)}
                placeholder="https://twitter.com/username"
              />
              <Input
                value={formData.instagram}
                onChangeText={(v) => updateField("instagram", v)}
                placeholder="https://instagram.com/username"
              />
              <Input
                value={formData.facebook}
                onChangeText={(v) => updateField("facebook", v)}
                placeholder="https://facebook.com/username"
              />
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row gap-3 mt-2">
            <Button
              variant="outline"
              onPress={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              <Text className="text-foreground text-sm font-medium">Cancelar</Text>
            </Button>
            <Button
              onPress={handleSubmit}
              loading={isSubmitting}
              className="flex-1 bg-brand"
            >
              <Text className="text-white text-sm font-medium">Salvar</Text>
            </Button>
          </View>
        </View>
      </SheetContent>
    </Sheet>
  );
}

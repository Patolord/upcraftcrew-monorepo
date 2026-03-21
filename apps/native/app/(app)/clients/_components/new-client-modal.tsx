import { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewClientModal({ isOpen, onClose }: NewClientModalProps) {
  const createClient = useMutation(api.clients.createClient);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Erro", "Informe o nome do cliente");
      return;
    }

    setIsSubmitting(true);
    try {
      await createClient({
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });

      Alert.alert("Sucesso", "Cliente cadastrado!");
      setFormData({ name: "", email: "", phone: "", company: "", notes: "" });
      onClose();
    } catch (error) {
      console.error("Failed to create client:", error);
      Alert.alert("Erro", "Falha ao cadastrar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && !isSubmitting && onClose()}>
      <SheetContent>
        <SheetHeader onClose={!isSubmitting ? onClose : undefined}>
          <SheetTitle>Novo Cliente</SheetTitle>
        </SheetHeader>

        <View className="px-6 gap-4 pb-6">
          <Input
            label="Nome *"
            value={formData.name}
            onChangeText={(v) => updateField("name", v)}
            placeholder="Nome do cliente"
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label="Email"
                value={formData.email}
                onChangeText={(v) => updateField("email", v)}
                placeholder="email@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Telefone"
                value={formData.phone}
                onChangeText={(v) => updateField("phone", v)}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Input
            label="Empresa"
            value={formData.company}
            onChangeText={(v) => updateField("company", v)}
            placeholder="Nome da empresa"
          />

          <View>
            <Label className="mb-1.5">Observações</Label>
            <TextInput
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground min-h-[80px]"
              value={formData.notes}
              onChangeText={(v) => updateField("notes", v)}
              placeholder="Notas adicionais..."
              placeholderTextColor="#737373"
              multiline
              textAlignVertical="top"
            />
          </View>

          <View className="flex-row gap-3 mt-2">
            <Button variant="outline" onPress={onClose} disabled={isSubmitting} className="flex-1">
              <Text className="text-foreground text-sm font-medium">Cancelar</Text>
            </Button>
            <Button onPress={handleSubmit} loading={isSubmitting} className="flex-1 bg-brand">
              <Text className="text-white text-sm font-medium">Cadastrar</Text>
            </Button>
          </View>
        </View>
      </SheetContent>
    </Sheet>
  );
}

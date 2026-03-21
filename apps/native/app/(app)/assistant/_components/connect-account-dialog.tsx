import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import Constants from "expo-constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Account {
  _id: Id<"emailAccounts">;
  provider: "gmail" | "outlook";
  email: string;
  isActive: boolean;
}

interface ConnectAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
}

const WEB_URL =
  process.env.EXPO_PUBLIC_WEB_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_WEB_URL || "";

export function ConnectAccountDialog({ open, onOpenChange, accounts }: ConnectAccountDialogProps) {
  const removeAccount = useMutation(api.emailAccounts.removeAccount);

  const gmailAccounts = accounts.filter((a) => a.provider === "gmail");
  const outlookAccounts = accounts.filter((a) => a.provider === "outlook");

  const handleConnectGmail = async () => {
    if (!WEB_URL) {
      Alert.alert("Erro", "URL do app web não configurada (EXPO_PUBLIC_WEB_URL)");
      return;
    }
    await WebBrowser.openBrowserAsync(`${WEB_URL}/api/email/gmail/auth`);
  };

  const handleConnectOutlook = async () => {
    if (!WEB_URL) {
      Alert.alert("Erro", "URL do app web não configurada (EXPO_PUBLIC_WEB_URL)");
      return;
    }
    await WebBrowser.openBrowserAsync(`${WEB_URL}/api/email/outlook/auth`);
  };

  const handleRemove = async (accountId: Id<"emailAccounts">, email: string) => {
    Alert.alert("Remover conta", `Deseja remover ${email}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await removeAccount({ accountId });
          } catch (err) {
            console.error("Failed to remove account:", err);
            Alert.alert("Erro", "Falha ao remover conta");
          }
        },
      },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader onClose={() => onOpenChange(false)}>
          <DialogTitle>Gerenciar Contas</DialogTitle>
          <DialogDescription>
            Conecte suas contas Gmail e Outlook para ver todos os e-mails.
          </DialogDescription>
        </DialogHeader>

        <View className="gap-5">
          {/* Gmail section */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-3 w-3 rounded-full bg-red-500" />
                <Text className="text-sm font-medium text-foreground">Gmail</Text>
                {gmailAccounts.length > 0 && (
                  <Badge variant="secondary">
                    <Text className="text-[10px] text-foreground">{gmailAccounts.length}</Text>
                  </Badge>
                )}
              </View>
              <Button variant="outline" size="sm" onPress={handleConnectGmail}>
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="mail-outline" size={14} color="#737373" />
                  <Text className="text-xs text-foreground font-medium">Conectar</Text>
                </View>
              </Button>
            </View>

            {gmailAccounts.map((account) => (
              <View
                key={account._id}
                className="flex-row items-center justify-between py-1.5 px-3 bg-muted/50 rounded-lg ml-5"
              >
                <Text className="text-sm text-foreground flex-1" numberOfLines={1}>
                  {account.email}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemove(account._id, account.email)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Outlook section */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-3 w-3 rounded-full bg-blue-500" />
                <Text className="text-sm font-medium text-foreground">Outlook</Text>
                {outlookAccounts.length > 0 && (
                  <Badge variant="secondary">
                    <Text className="text-[10px] text-foreground">{outlookAccounts.length}</Text>
                  </Badge>
                )}
              </View>
              <Button variant="outline" size="sm" onPress={handleConnectOutlook}>
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="mail-outline" size={14} color="#737373" />
                  <Text className="text-xs text-foreground font-medium">Conectar</Text>
                </View>
              </Button>
            </View>

            {outlookAccounts.map((account) => (
              <View
                key={account._id}
                className="flex-row items-center justify-between py-1.5 px-3 bg-muted/50 rounded-lg ml-5"
              >
                <Text className="text-sm text-foreground flex-1" numberOfLines={1}>
                  {account.email}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemove(account._id, account.email)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text className="text-xs text-muted-foreground leading-4">
            Suas credenciais são armazenadas de forma segura e usadas apenas para leitura. Ao
            responder, você será redirecionado para o app do provedor.
          </Text>
        </View>
      </DialogContent>
    </Dialog>
  );
}

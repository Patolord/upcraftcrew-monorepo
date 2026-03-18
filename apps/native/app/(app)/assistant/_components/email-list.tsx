import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

export interface EmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  isRead: boolean;
  accountId: string;
  accountEmail: string;
  provider: string;
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) {
      return date.toLocaleDateString("pt-BR", { weekday: "short" });
    }
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch {
    return dateStr;
  }
}

function parseFromName(from: string) {
  const match = from.match(/^(.+?)\s*<.+>$/);
  return match ? match[1].replace(/"/g, "") : from;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

interface EmailListProps {
  emails: EmailMessage[];
  onSelect: (emailId: string, accountId: string) => void;
  onMarkAsRead?: (emailId: string, accountId: string) => void;
  selectedId: string | null;
}

export function EmailList({ emails, onSelect, onMarkAsRead, selectedId }: EmailListProps) {
  return (
    <View className="bg-card rounded-xl overflow-hidden border border-border">
      {emails.map((email, index) => {
        const fromName = parseFromName(email.from);
        const initials = getInitials(fromName);
        const isSelected = selectedId === email.id;
        const isGmail = email.provider === "gmail";
        const showDivider = index < emails.length - 1;

        return (
          <TouchableOpacity
            key={`${email.accountId}-${email.id}`}
            onPress={() => onSelect(email.id, email.accountId)}
            activeOpacity={0.7}
            className={cn(
              "flex-row items-start gap-3 p-3",
              isSelected && "bg-orange-50",
              !email.isRead && "bg-blue-50/50",
            )}
          >
            {/* Avatar */}
            <View
              className={cn(
                "h-10 w-10 rounded-full items-center justify-center",
                isGmail ? "bg-red-500" : "bg-blue-600",
              )}
            >
              <Text className="text-xs font-medium text-white">{initials}</Text>
            </View>

            {/* Content */}
            <View className="flex-1 min-w-0">
              <View className="flex-row items-center gap-2 mb-0.5">
                <Text
                  className={cn(
                    "text-sm flex-1",
                    !email.isRead ? "font-semibold text-foreground" : "font-medium text-foreground/80",
                  )}
                  numberOfLines={1}
                >
                  {fromName}
                </Text>
                {!email.isRead && (
                  <View className="h-2 w-2 rounded-full bg-brand" />
                )}
              </View>
              <Text
                className={cn(
                  "text-sm",
                  !email.isRead ? "font-medium text-foreground" : "text-foreground/70",
                )}
                numberOfLines={1}
              >
                {email.subject || "(sem assunto)"}
              </Text>
              <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1}>
                {email.snippet}
              </Text>
            </View>

            {/* Meta */}
            <View className="items-end gap-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-xs text-muted-foreground">{formatDate(email.date)}</Text>
                {!email.isRead && onMarkAsRead && (
                  <TouchableOpacity
                    onPress={() => onMarkAsRead(email.id, email.accountId)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="mail-open-outline" size={14} color="#737373" />
                  </TouchableOpacity>
                )}
              </View>
              <View
                className={cn(
                  "px-1.5 py-0.5 rounded-full",
                  isGmail ? "bg-red-100" : "bg-blue-100",
                )}
              >
                <Text
                  className={cn(
                    "text-[10px] font-medium",
                    isGmail ? "text-red-700" : "text-blue-700",
                  )}
                  numberOfLines={1}
                >
                  {email.accountEmail.split("@")[0]}
                </Text>
              </View>
            </View>

            {/* Divider */}
            {showDivider && (
              <View className="absolute bottom-0 left-16 right-0 h-px bg-border" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

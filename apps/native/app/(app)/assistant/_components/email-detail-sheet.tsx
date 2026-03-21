import { View, Text, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface EmailDetail {
  id: string;
  threadId: string;
  from: string;
  to: string;
  cc?: string;
  subject: string;
  date: string;
  body: string;
  snippet: string;
  provider: "gmail" | "outlook";
  accountEmail: string;
}

interface EmailDetailSheetProps {
  open: boolean;
  onClose: () => void;
  email: EmailDetail | null;
  loading: boolean;
}

function getReplyUrl(email: EmailDetail) {
  const fromMatch = email.from.match(/<(.+?)>/);
  const replyTo = fromMatch ? fromMatch[1] : email.from;

  if (email.provider === "gmail") {
    return `https://mail.google.com/mail/?authuser=${encodeURIComponent(email.accountEmail)}&view=cm&to=${encodeURIComponent(replyTo)}&su=${encodeURIComponent(`Re: ${email.subject}`)}`;
  }
  return `https://outlook.live.com/mail/deeplink/compose?to=${encodeURIComponent(replyTo)}&subject=${encodeURIComponent(`Re: ${email.subject}`)}`;
}

function formatFullDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function parseFromName(from: string) {
  const match = from.match(/^(.+?)\s*<(.+?)>$/);
  if (match) return { name: match[1].replace(/"/g, ""), email: match[2] };
  return { name: from, email: from };
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function EmailDetailSheet({ open, onClose, email, loading }: EmailDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        <SheetHeader onClose={onClose}>
          {loading ? (
            <View className="gap-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32" />
            </View>
          ) : email ? (
            <View className="gap-1.5">
              <SheetTitle numberOfLines={2}>{email.subject || "(sem assunto)"}</SheetTitle>
              <SheetDescription className="sr-only">
                {email.subject || "Detalhes do e-mail"}
              </SheetDescription>
              <Badge variant="outline" className="self-start">
                <View className="flex-row items-center gap-1">
                  <View
                    className={`h-1.5 w-1.5 rounded-full ${email.provider === "gmail" ? "bg-red-500" : "bg-blue-500"}`}
                  />
                  <Text className="text-[10px] text-foreground font-medium">
                    {email.accountEmail}
                  </Text>
                </View>
              </Badge>
            </View>
          ) : null}
        </SheetHeader>

        <View className="px-6 pb-6">
          {loading ? (
            <View className="gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <View className="mt-4 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-3 w-full" />
                ))}
              </View>
            </View>
          ) : email ? (
            <View className="gap-4">
              {/* Sender info */}
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="person-outline" size={16} color="#737373" />
                  <Text className="text-sm font-medium text-foreground">
                    {parseFromName(email.from).name}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    &lt;{parseFromName(email.from).email}&gt;
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="calendar-outline" size={16} color="#737373" />
                  <Text className="text-xs text-muted-foreground">
                    {formatFullDate(email.date)}
                  </Text>
                </View>
                {email.to && (
                  <Text className="text-xs text-muted-foreground">
                    <Text className="font-medium">Para:</Text> {email.to}
                  </Text>
                )}
                {email.cc && (
                  <Text className="text-xs text-muted-foreground">
                    <Text className="font-medium">Cc:</Text> {email.cc}
                  </Text>
                )}
              </View>

              {/* Reply button */}
              <Button
                variant="outline"
                size="sm"
                onPress={() => Linking.openURL(getReplyUrl(email))}
                className="self-start"
              >
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="return-up-back-outline" size={16} color="#737373" />
                  <Text className="text-sm text-foreground font-medium">Responder</Text>
                  <Ionicons name="open-outline" size={12} color="#737373" />
                </View>
              </Button>

              {/* Email body */}
              <View className="border-t border-border pt-4">
                <Text className="text-sm text-foreground/80 leading-5">
                  {email.body.includes("<") ? stripHtml(email.body) : email.body || email.snippet}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </SheetContent>
    </Sheet>
  );
}

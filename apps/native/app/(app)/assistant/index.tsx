import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery, useAction } from "convex/react";
import { useState, useCallback, useEffect } from "react";
import {
  RefreshControl,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

import { AssistantHeader } from "./_components/assistant-header";
import { EmailList, type EmailMessage } from "./_components/email-list";
import { EmailDetailSheet } from "./_components/email-detail-sheet";
import { ConnectAccountDialog } from "./_components/connect-account-dialog";

type Folder = "inbox" | "sent" | "trash";

const ITEMS_PER_PAGE = 7;

const folderConfig: { key: Folder; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "inbox", label: "Entrada", icon: "mail-outline" },
  { key: "sent", label: "Enviados", icon: "send-outline" },
  { key: "trash", label: "Lixeira", icon: "trash-outline" },
];

export default function AssistantPage() {
  const accounts = useQuery(api.emailAccounts.getMyAccounts);
  const fetchEmails = useAction(api.emailAccounts.fetchEmails);
  const fetchEmailDetail = useAction(api.emailAccounts.fetchEmailDetail);

  const [folder, setFolder] = useState<Folder>("inbox");
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState<{ id: string; accountId: string } | null>(null);
  const [emailDetail, setEmailDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [filterAccountId, setFilterAccountId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const loadEmails = useCallback(async () => {
    if (!accounts || accounts.length === 0) return;
    setLoading(true);
    setCurrentPage(1);
    try {
      const result = await fetchEmails({
        folder,
        limit: 50,
        ...(filterAccountId ? { accountId: filterAccountId as any } : {}),
      });
      setEmails(result.messages as EmailMessage[]);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
      Alert.alert("Erro", "Falha ao carregar e-mails");
    } finally {
      setLoading(false);
    }
  }, [accounts?.length, fetchEmails, folder, filterAccountId]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  const emailsWithReadState = emails.map((e) => ({
    ...e,
    isRead: e.isRead || readIds.has(`${e.accountId}-${e.id}`),
  }));
  const filteredEmails = showUnreadOnly
    ? emailsWithReadState.filter((e) => !e.isRead)
    : emailsWithReadState;
  const totalPages = Math.ceil(filteredEmails.length / ITEMS_PER_PAGE);
  const paginatedEmails = filteredEmails.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const unreadCount = emailsWithReadState.filter((e) => !e.isRead).length;

  const handleMarkAsRead = useCallback((emailId: string, accountId: string) => {
    setReadIds((prev) => new Set(prev).add(`${accountId}-${emailId}`));
  }, []);

  const handleSelectEmail = useCallback(
    async (emailId: string, accountId: string) => {
      setSelectedEmail({ id: emailId, accountId });
      setLoadingDetail(true);
      try {
        const detail = await fetchEmailDetail({
          accountId: accountId as any,
          messageId: emailId,
        });
        setEmailDetail(detail);
      } catch (err) {
        console.error("Failed to fetch email detail:", err);
        Alert.alert("Erro", "Falha ao carregar e-mail");
      } finally {
        setLoadingDetail(false);
      }
    },
    [fetchEmailDetail],
  );

  const handleCloseDetail = useCallback(() => {
    setSelectedEmail(null);
    setEmailDetail(null);
  }, []);

  if (accounts === undefined) {
    return (
      <View className="flex-1 bg-admin-background pt-12">
        <View className="px-4 gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-full rounded-xl" />
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} className="flex-row gap-3 items-start">
              <Skeleton className="h-10 w-10 rounded-full" />
              <View className="flex-1 gap-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  const activeAccounts = accounts.filter((a) => a.isActive);
  const hasAccounts = activeAccounts.length > 0;

  return (
    <View className="flex-1 bg-admin-background pt-12">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadEmails} tintColor="#ff8e29" />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 gap-4">
          <AssistantHeader
            hasAccounts={hasAccounts}
            loading={loading}
            onRefresh={loadEmails}
            onConnect={() => setConnectDialogOpen(true)}
          />

          {/* Account badges */}
          {hasAccounts && (
            <View className="flex-row flex-wrap items-center gap-2">
              <Text className="text-xs text-muted-foreground mr-1">Contas:</Text>
              {activeAccounts.map((account) => (
                <TouchableOpacity
                  key={account._id}
                  onPress={() =>
                    setFilterAccountId(
                      filterAccountId === account._id ? null : account._id,
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Badge
                    variant={filterAccountId === account._id ? "default" : "outline"}
                    className="flex-row items-center"
                  >
                    <View className="flex-row items-center gap-1">
                      <View
                        className={cn(
                          "h-2 w-2 rounded-full",
                          account.provider === "gmail" ? "bg-red-500" : "bg-blue-500",
                        )}
                      />
                      <Text
                        className={cn(
                          "text-xs",
                          filterAccountId === account._id
                            ? "text-white font-medium"
                            : "text-foreground",
                        )}
                        numberOfLines={1}
                      >
                        {account.email}
                      </Text>
                    </View>
                  </Badge>
                </TouchableOpacity>
              ))}
              {filterAccountId && (
                <TouchableOpacity onPress={() => setFilterAccountId(null)}>
                  <Text className="text-xs text-muted-foreground underline">Limpar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Folder tabs + unread filter */}
          {hasAccounts && (
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row bg-muted rounded-lg p-1">
                  {folderConfig.map((f) => (
                    <TouchableOpacity
                      key={f.key}
                      onPress={() => {
                        setFolder(f.key);
                        setCurrentPage(1);
                      }}
                      className={cn(
                        "flex-row items-center gap-1.5 px-3 py-1.5 rounded-md",
                        folder === f.key && "bg-card shadow-sm",
                      )}
                    >
                      <Ionicons
                        name={f.icon}
                        size={14}
                        color={folder === f.key ? "#ff8e29" : "#737373"}
                      />
                      <Text
                        className={cn(
                          "text-xs font-medium",
                          folder === f.key ? "text-brand" : "text-muted-foreground",
                        )}
                      >
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setShowUnreadOnly((v) => !v);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg border",
                    showUnreadOnly
                      ? "bg-brand border-brand"
                      : "bg-transparent border-border",
                  )}
                >
                  <Ionicons
                    name="mail-outline"
                    size={14}
                    color={showUnreadOnly ? "#fff" : "#737373"}
                  />
                  <Text
                    className={cn(
                      "text-xs font-medium",
                      showUnreadOnly ? "text-white" : "text-muted-foreground",
                    )}
                  >
                    {unreadCount}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Email list or empty */}
              {loading ? (
                <View className="gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <View key={i} className="flex-row gap-3 items-start p-3 bg-card rounded-xl">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <View className="flex-1 gap-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </View>
                      <Skeleton className="h-3 w-12" />
                    </View>
                  ))}
                </View>
              ) : filteredEmails.length === 0 ? (
                <View className="bg-card rounded-xl p-4">
                  <EmptyState
                    icon="mail-outline"
                    title="Nenhum e-mail encontrado"
                    description={`A pasta "${folder === "inbox" ? "Caixa de Entrada" : folder === "sent" ? "Enviados" : "Lixeira"}" está vazia`}
                  />
                </View>
              ) : (
                <>
                  <EmailList
                    emails={paginatedEmails}
                    onSelect={handleSelectEmail}
                    onMarkAsRead={handleMarkAsRead}
                    selectedId={selectedEmail?.id ?? null}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <View className="flex-row items-center justify-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onPress={() => setCurrentPage((p) => p - 1)}
                      >
                        <Text className="text-xs text-foreground">Anterior</Text>
                      </Button>
                      <Text className="text-xs text-muted-foreground">
                        {currentPage} / {totalPages}
                      </Text>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onPress={() => setCurrentPage((p) => p + 1)}
                      >
                        <Text className="text-xs text-foreground">Próxima</Text>
                      </Button>
                    </View>
                  )}
                </>
              )}
            </View>
          )}

          {/* No accounts state */}
          {!hasAccounts && (
            <View className="bg-card rounded-xl p-6">
              <EmptyState
                icon="mail-outline"
                title="Nenhuma conta conectada"
                description="Conecte suas contas Gmail e Outlook para ver todos os seus e-mails em um só lugar"
                action={
                  <Button
                    onPress={() => setConnectDialogOpen(true)}
                    className="bg-brand"
                  >
                    <View className="flex-row items-center gap-1.5">
                      <Ionicons name="add" size={16} color="#fff" />
                      <Text className="text-sm text-white font-medium">Conectar Conta</Text>
                    </View>
                  </Button>
                }
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Email detail sheet */}
      <EmailDetailSheet
        open={selectedEmail !== null}
        onClose={handleCloseDetail}
        email={emailDetail}
        loading={loadingDetail}
      />

      {/* Connect dialog */}
      <ConnectAccountDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        accounts={activeAccounts}
      />
    </View>
  );
}

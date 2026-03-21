"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { usePreloadedQuery, useAction, useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Preloaded } from "convex/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  InboxIcon,
  SendIcon,
  Trash2Icon,
  PlusIcon,
  MailIcon,
  RefreshCwIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";
import { ConnectAccountDialog } from "./connect-account-dialog";
import { EmailList } from "./email-list";
import { EmailDetailSheet, type EmailDetail } from "./email-detail-sheet";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

type Folder = "inbox" | "sent" | "trash" | "favorites";

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

interface AssistantPageProps {
  preloadedAccounts: Preloaded<typeof api.emailAccounts.getMyAccounts>;
  preloadedFavorites: Preloaded<typeof api.emailAccounts.getMyFavorites>;
}

export function AssistantPage({ preloadedAccounts, preloadedFavorites }: AssistantPageProps) {
  const accounts = usePreloadedQuery(preloadedAccounts);
  const favorites = usePreloadedQuery(preloadedFavorites);
  const fetchEmails = useAction(api.emailAccounts.fetchEmails);
  const fetchEmailDetail = useAction(api.emailAccounts.fetchEmailDetail);
  const toggleFavoriteAddress = useMutation(api.emailAccounts.toggleFavoriteAddress);
  const archiveEmailAction = useAction(api.emailAccounts.archiveEmail);

  const ITEMS_PER_PAGE = 7;

  const [folder, setFolder] = useState<Folder>("inbox");
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState<{
    id: string;
    accountId: string;
  } | null>(null);
  const [emailDetail, setEmailDetail] = useState<EmailDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [filterAccountId, setFilterAccountId] = useState<Id<"emailAccounts"> | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const connected = searchParams.get("connected");
    const email = searchParams.get("email");
    const error = searchParams.get("error");

    if (connected && email) {
      toast.success(`Conta ${connected} conectada`, {
        description: decodeURIComponent(email),
      });
    }
    if (error) {
      const errorMessages: Record<string, string> = {
        not_authenticated: "Voce precisa estar logado",
        oauth_denied: "Autorizacao negada pelo provedor",
        token_exchange_failed: "Falha ao trocar tokens",
        convex_token_failed: "Falha na autenticacao interna",
        callback_failed: "Falha no callback OAuth",
      };
      toast.error("Erro ao conectar conta", {
        description: errorMessages[error] || error,
      });
    }
  }, [searchParams]);

  const loadEmails = useCallback(async () => {
    if (accounts.length === 0) return;
    setLoading(true);
    setCurrentPage(1);
    try {
      const apiFolder = folder === "favorites" ? "inbox" : folder;
      const result = await fetchEmails({
        folder: apiFolder as "inbox" | "sent" | "trash",
        limit: 50,
        ...(filterAccountId ? { accountId: filterAccountId } : {}),
      });
      setEmails(result.messages as EmailMessage[]);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
      toast.error("Erro ao carregar e-mails", {
        description: "Verifique suas contas conectadas",
      });
    } finally {
      setLoading(false);
    }
  }, [accounts.length, fetchEmails, folder, filterAccountId]);

  const favoriteAddresses = useMemo(
    () => new Set(favorites.map((f) => f.emailAddress.toLowerCase())),
    [favorites],
  );

  const emailsWithReadState = emails.map((e) => ({
    ...e,
    isRead: e.isRead || readIds.has(`${e.accountId}-${e.id}`),
  }));
  const searchLower = searchQuery.toLowerCase();
  const afterFavFilter =
    folder === "favorites"
      ? emailsWithReadState.filter((e) => {
          const m = e.from.match(/<(.+?)>/);
          const addr = (m ? m[1] : e.from).toLowerCase();
          return favoriteAddresses.has(addr);
        })
      : emailsWithReadState;
  const searchFiltered = afterFavFilter.filter(
    (e) =>
      !searchQuery ||
      e.from.toLowerCase().includes(searchLower) ||
      e.subject.toLowerCase().includes(searchLower) ||
      e.snippet.toLowerCase().includes(searchLower),
  );
  const filteredEmails = showUnreadOnly ? searchFiltered.filter((e) => !e.isRead) : searchFiltered;
  const totalPages = Math.ceil(filteredEmails.length / ITEMS_PER_PAGE);
  const paginatedEmails = filteredEmails.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const unreadCount = emailsWithReadState.filter((e) => !e.isRead).length;

  const handleMarkAsRead = useCallback(
    (emailId: string, accountId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setReadIds((prev) => new Set(prev).add(`${accountId}-${emailId}`));
    },
    [],
  );

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  const handleSelectEmail = useCallback(
    async (emailId: string, accountId: string) => {
      setSelectedEmail({ id: emailId, accountId });
      setLoadingDetail(true);
      try {
        const detail = await fetchEmailDetail({
          accountId: accountId as Id<"emailAccounts">,
          messageId: emailId,
        });
        setEmailDetail(detail);
      } catch (err) {
        console.error("Failed to fetch email detail:", err);
        toast.error("Erro ao carregar e-mail");
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

  const handleToggleFavorite = useCallback(
    async (email: EmailMessage, e: React.MouseEvent) => {
      e.stopPropagation();
      const match = email.from.match(/<(.+?)>/);
      const address = match ? match[1] : email.from;
      const nameMatch = email.from.match(/^(.+?)\s*<.+>$/);
      const displayName = nameMatch ? nameMatch[1].replace(/"/g, "") : undefined;
      try {
        const result = await toggleFavoriteAddress({ emailAddress: address, displayName });
        toast.success(
          result.favorited
            ? `${address} adicionado aos favoritos`
            : `${address} removido dos favoritos`,
        );
      } catch {
        toast.error("Erro ao atualizar favorito");
      }
    },
    [toggleFavoriteAddress],
  );

  const handleArchiveEmail = useCallback(
    async (emailId: string, accountId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        const result = await archiveEmailAction({
          accountId: accountId as Id<"emailAccounts">,
          messageId: emailId,
        });
        setEmails((prev) => prev.filter((em) => em.id !== emailId));
        if (selectedEmail?.id === emailId) {
          setSelectedEmail(null);
          setEmailDetail(null);
        }
        const providerName = result.provider === "gmail" ? "Gmail" : "Outlook";
        toast.success(`E-mail arquivado no ${providerName}`);
      } catch {
        toast.error("Erro ao arquivar e-mail", {
          description: "Pode ser necessario reconectar a conta com novas permissoes",
        });
      }
    },
    [archiveEmailAction, selectedEmail],
  );

  const handleArchiveFromDetail = useCallback(async () => {
    if (!emailDetail || !selectedEmail) return;
    const fakeEvent = { stopPropagation: () => {} } as React.MouseEvent;
    await handleArchiveEmail(selectedEmail.id, selectedEmail.accountId, fakeEvent);
  }, [emailDetail, selectedEmail, handleArchiveEmail]);

  const handleToggleFavoriteFromDetail = useCallback(async () => {
    if (!emailDetail) return;
    const match = emailDetail.from.match(/<(.+?)>/);
    const address = match ? match[1] : emailDetail.from;
    const nameMatch = emailDetail.from.match(/^(.+?)\s*<.+>$/);
    const displayName = nameMatch ? nameMatch[1].replace(/"/g, "") : undefined;
    try {
      const result = await toggleFavoriteAddress({ emailAddress: address, displayName });
      toast.success(
        result.favorited
          ? `${address} adicionado aos favoritos`
          : `${address} removido dos favoritos`,
      );
    } catch {
      toast.error("Erro ao atualizar favorito");
    }
  }, [emailDetail, toggleFavoriteAddress]);

  const activeAccounts = accounts.filter((a) => a.isActive);
  const hasAccounts = activeAccounts.length > 0;

  return (
    <div className="p-4 md:p-6 md:pl-12 md:pr-12 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">Assistente</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Todas as suas caixas de e-mail em um só lugar
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasAccounts && (
            <Button
              variant="outline"
              size="sm"
              onClick={loadEmails}
              disabled={loading}
              className="rounded-md"
            >
              <RefreshCwIcon className={`size-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          )}
          <Button
            onClick={() => setConnectDialogOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 text-sm"
          >
            <PlusIcon className="size-4 mr-2" />
            Conectar Conta
          </Button>
        </div>
      </div>

      {/* Connected accounts badges */}
      {hasAccounts && (
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="text-xs text-muted-foreground mr-1 shrink-0">Contas:</span>
          {activeAccounts.map((account) => (
            <Badge
              key={account._id}
              variant={filterAccountId === account._id ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() =>
                setFilterAccountId(filterAccountId === account._id ? null : account._id)
              }
            >
              {account.provider === "gmail" ? (
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5" />
              ) : (
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
              )}
              {account.email}
            </Badge>
          ))}
          {filterAccountId && (
            <button
              onClick={() => setFilterAccountId(null)}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Limpar filtro
            </button>
          )}
        </div>
      )}

      {/* Search */}
      {hasAccounts && (
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por remetente, assunto ou conteudo..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-9 text-sm"
          />
        </div>
      )}

      {/* Folder tabs + content */}
      {hasAccounts ? (
        <>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Tabs
              value={folder}
              onValueChange={(v) => {
                setFolder(v as Folder);
                setCurrentPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="inbox" className="gap-1.5">
                  <InboxIcon className="size-4" />
                  <span className="hidden sm:inline">Caixa de Entrada</span>
                  <span className="sm:hidden">Entrada</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-1.5">
                  <StarIcon className="size-4" />
                  <span className="hidden sm:inline">Favoritos</span>
                  <span className="sm:hidden">Fav</span>
                  {favorites.length > 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-0.5 h-4">
                      {favorites.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent" className="gap-1.5">
                  <SendIcon className="size-4" />
                  <span className="hidden sm:inline">Enviados</span>
                  <span className="sm:hidden">Enviados</span>
                </TabsTrigger>
                <TabsTrigger value="trash" className="gap-1.5">
                  <Trash2Icon className="size-4" />
                  <span className="hidden sm:inline">Lixeira</span>
                  <span className="sm:hidden">Lixo</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant={showUnreadOnly ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowUnreadOnly((v) => !v);
                setCurrentPage(1);
              }}
              className={`rounded-md text-xs gap-1.5 ${showUnreadOnly ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
            >
              <MailIcon className="size-3.5" />
              Não lidos
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1 h-4">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-white dark:bg-card rounded-lg border"
                >
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-3 w-16 shrink-0" />
                </div>
              ))}
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="bg-white dark:bg-card rounded-lg shadow-sm p-4">
              <EmptyState
                icon={folder === "favorites" ? StarIcon : MailIcon}
                title={
                  folder === "favorites" ? "Nenhum favorito encontrado" : "Nenhum e-mail encontrado"
                }
                description={
                  folder === "favorites"
                    ? "Favorite enderecos de e-mail clicando na estrela para ve-los aqui"
                    : `A pasta "${folder === "inbox" ? "Caixa de Entrada" : folder === "sent" ? "Enviados" : "Lixeira"}" esta vazia`
                }
              />
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border">
                <EmailList
                  emails={paginatedEmails}
                  onSelect={handleSelectEmail}
                  onMarkAsRead={handleMarkAsRead}
                  selectedId={selectedEmail?.id ?? null}
                  favoriteAddresses={favoriteAddresses}
                  onToggleFavorite={handleToggleFavorite}
                  onArchive={folder === "inbox" ? handleArchiveEmail : undefined}
                  folder={folder}
                />
              </div>

              {totalPages > 1 &&
                (() => {
                  const GROUP_SIZE = 3;
                  const groupIndex = Math.floor((currentPage - 1) / GROUP_SIZE);
                  const groupStart = groupIndex * GROUP_SIZE + 1;
                  const groupEnd = Math.min(groupStart + GROUP_SIZE - 1, totalPages);
                  const pages = Array.from(
                    { length: groupEnd - groupStart + 1 },
                    (_, i) => groupStart + i,
                  );

                  return (
                    <div className="flex items-center justify-center gap-1 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={groupStart === 1}
                        onClick={() => setCurrentPage(groupStart - 1)}
                        className="rounded-md px-3 text-xs"
                      >
                        Anterior
                      </Button>
                      {pages.map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`rounded-md px-3 text-xs min-w-8 ${currentPage === page ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={groupEnd === totalPages}
                        onClick={() => setCurrentPage(groupEnd + 1)}
                        className="rounded-md px-3 text-xs"
                      >
                        Proxima
                      </Button>
                    </div>
                  );
                })()}
            </>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-card rounded-lg shadow-sm p-8">
          <EmptyState
            icon={MailIcon}
            title="Nenhuma conta conectada"
            description="Conecte suas contas Gmail e Outlook para ver todos os seus e-mails em um só lugar"
            action={
              <Button
                onClick={() => setConnectDialogOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-md"
              >
                <PlusIcon className="size-4 mr-2" />
                Conectar Conta
              </Button>
            }
          />
        </div>
      )}

      {/* Email detail sheet */}
      <EmailDetailSheet
        open={selectedEmail !== null}
        onClose={handleCloseDetail}
        email={emailDetail}
        loading={loadingDetail}
        isFavorite={
          emailDetail
            ? (() => {
                const m = emailDetail.from.match(/<(.+?)>/);
                return favoriteAddresses.has((m ? m[1] : emailDetail.from).toLowerCase());
              })()
            : false
        }
        onToggleFavorite={handleToggleFavoriteFromDetail}
        onArchive={handleArchiveFromDetail}
      />

      {/* Connect account dialog */}
      <ConnectAccountDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        accounts={activeAccounts}
      />
    </div>
  );
}

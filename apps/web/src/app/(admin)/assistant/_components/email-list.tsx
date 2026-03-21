"use client";

import { cn } from "@/lib/utils";
import { MailCheckIcon, StarIcon, ArchiveIcon } from "lucide-react";
import type { EmailMessage } from "./assistant-page";

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) {
      return date.toLocaleDateString("pt-BR", { weekday: "short" });
    }
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
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
  onMarkAsRead?: (emailId: string, accountId: string, e: React.MouseEvent) => void;
  selectedId: string | null;
  favoriteAddresses?: Set<string>;
  onToggleFavorite?: (email: EmailMessage, e: React.MouseEvent) => void;
  onArchive?: (emailId: string, accountId: string, e: React.MouseEvent) => void;
  folder?: string;
}

function extractEmailAddress(from: string): string {
  const match = from.match(/<(.+?)>/);
  return (match ? match[1] : from).toLowerCase();
}

export function EmailList({
  emails,
  onSelect,
  onMarkAsRead,
  selectedId,
  favoriteAddresses,
  onToggleFavorite,
  onArchive,
  folder,
}: EmailListProps) {
  return (
    <div className="w-full min-w-0 bg-white dark:bg-card divide-y divide-border">
      {emails.map((email) => {
        const fromName = parseFromName(email.from);
        const initials = getInitials(fromName);
        const isSelected = selectedId === email.id;
        const isGmail = email.provider === "gmail";
        const isFav = favoriteAddresses?.has(extractEmailAddress(email.from)) ?? false;

        return (
          <div
            key={`${email.accountId}-${email.id}`}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(email.id, email.accountId)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(email.id, email.accountId);
              }
            }}
            className={cn(
              "w-full flex items-start gap-3 p-3 sm:p-4 text-left transition-colors hover:bg-muted/50 min-w-0 cursor-pointer",
              isSelected && "bg-orange-50 dark:bg-orange-950/20",
              !email.isRead && "bg-blue-50/50 dark:bg-blue-950/10",
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                "shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium text-white",
                isGmail ? "bg-red-500" : "bg-blue-600",
              )}
            >
              {initials}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={cn(
                    "text-sm truncate",
                    !email.isRead
                      ? "font-semibold text-foreground"
                      : "font-medium text-foreground/80",
                  )}
                >
                  {fromName}
                </span>
                {!email.isRead && <span className="shrink-0 w-2 h-2 rounded-full bg-orange-500" />}
              </div>
              <p
                className={cn(
                  "text-sm truncate",
                  !email.isRead ? "font-medium text-foreground" : "text-foreground/70",
                )}
              >
                {email.subject || "(sem assunto)"}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{email.snippet}</p>
            </div>

            {/* Meta */}
            <div className="shrink-0 flex flex-col items-end gap-1 min-w-0 max-w-28 sm:max-w-32">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(email.date)}
                </span>
                {onToggleFavorite && (
                  <button
                    onClick={(e) => onToggleFavorite(email, e)}
                    className={cn(
                      "transition-colors",
                      isFav
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-muted-foreground hover:text-yellow-500",
                    )}
                    title={isFav ? "Remover remetente dos favoritos" : "Favoritar remetente"}
                  >
                    <StarIcon className={cn("size-3.5", isFav && "fill-current")} />
                  </button>
                )}
                {onArchive && folder === "inbox" && (
                  <button
                    onClick={(e) => onArchive(email.id, email.accountId, e)}
                    className="text-muted-foreground hover:text-orange-500 transition-colors"
                    title="Arquivar"
                  >
                    <ArchiveIcon className="size-3.5" />
                  </button>
                )}
                {!email.isRead && onMarkAsRead && (
                  <button
                    onClick={(e) => onMarkAsRead(email.id, email.accountId, e)}
                    className="text-muted-foreground hover:text-orange-500 transition-colors"
                    title="Marcar como lido"
                  >
                    <MailCheckIcon className="size-3.5" />
                  </button>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-medium truncate max-w-full",
                  isGmail
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                )}
                title={email.accountEmail}
              >
                {email.accountEmail.split("@")[0]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

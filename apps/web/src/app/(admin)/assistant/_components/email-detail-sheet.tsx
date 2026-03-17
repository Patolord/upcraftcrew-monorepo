"use client";

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
import {
  ExternalLinkIcon,
  ReplyIcon,
  UserIcon,
  CalendarIcon,
} from "lucide-react";

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

export function EmailDetailSheet({
  open,
  onClose,
  email,
  loading,
}: EmailDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="sm:max-w-xl w-full flex flex-col min-w-0 overflow-hidden p-0"
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 pr-12">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <div className="mt-6 space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-full" />
              ))}
            </div>
          </div>
        ) : email ? (
          <>
            <SheetHeader className="border-b pb-4 shrink-0">
              <div className="flex items-start justify-between gap-2 pr-8">
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-base font-semibold leading-tight">
                    {email.subject || "(sem assunto)"}
                  </SheetTitle>
                  <SheetDescription className="mt-1">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-medium"
                    >
                      {email.provider === "gmail" ? (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1" />
                      ) : (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1" />
                      )}
                      {email.accountEmail}
                    </Badge>
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-4 min-w-0">
              {/* Sender info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <UserIcon className="size-4 text-muted-foreground shrink-0" />
                  <span className="font-medium">
                    {parseFromName(email.from).name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    &lt;{parseFromName(email.from).email}&gt;
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <CalendarIcon className="size-4 shrink-0" />
                  {formatFullDate(email.date)}
                </div>
                {email.to && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Para:</span> {email.to}
                  </div>
                )}
                {email.cc && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Cc:</span> {email.cc}
                  </div>
                )}
              </div>

              {/* Reply button */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-md"
                  onClick={() => window.open(getReplyUrl(email), "_blank")}
                >
                  <ReplyIcon className="size-4 mr-2" />
                  Responder
                  <ExternalLinkIcon className="size-3 ml-1.5 text-muted-foreground" />
                </Button>
              </div>

              {/* Email body */}
              <div className="border-t pt-4 min-w-0 overflow-x-auto">
                {email.body.includes("<") ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none min-w-0 [&_img]:max-w-full [&_table]:max-w-full [&_table]:text-xs [&_table]:table-fixed"
                    dangerouslySetInnerHTML={{ __html: email.body }}
                  />
                ) : (
                  <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed wrap-break-word min-w-0">
                    {email.body || email.snippet}
                  </pre>
                )}
              </div>
            </div>
          </>
        ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

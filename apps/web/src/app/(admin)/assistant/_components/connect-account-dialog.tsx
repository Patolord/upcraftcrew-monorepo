"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MailIcon, Trash2Icon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { toast } from "sonner";
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

export function ConnectAccountDialog({ open, onOpenChange, accounts }: ConnectAccountDialogProps) {
  const removeAccount = useMutation(api.emailAccounts.removeAccount);

  const gmailAccounts = accounts.filter((a) => a.provider === "gmail");
  const outlookAccounts = accounts.filter((a) => a.provider === "outlook");

  const handleRemove = async (accountId: Id<"emailAccounts">, email: string) => {
    try {
      await removeAccount({ accountId });
      toast.success("Conta removida", { description: email });
    } catch (err) {
      console.error("Failed to remove account:", err);
      toast.error("Erro ao remover conta");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Contas de E-mail</DialogTitle>
          <DialogDescription>
            Conecte suas contas Gmail e Outlook para visualizar todos os e-mails em um unico lugar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Gmail section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                <h3 className="text-sm font-medium">Gmail</h3>
                {gmailAccounts.length > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {gmailAccounts.length}
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md text-xs"
                onClick={() => {
                  window.location.href = "/api/email/gmail/auth";
                }}
              >
                <MailIcon className="size-3.5 mr-1.5" />
                Conectar Gmail
              </Button>
            </div>

            {gmailAccounts.length > 0 && (
              <div className="space-y-2 pl-5">
                {gmailAccounts.map((account) => (
                  <div
                    key={account._id}
                    className="flex items-center justify-between py-1.5 px-3 bg-muted/50 rounded-md"
                  >
                    <span className="text-sm text-foreground truncate">{account.email}</span>
                    <button
                      onClick={() => handleRemove(account._id, account.email)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Remover conta"
                    >
                      <Trash2Icon className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outlook section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
                <h3 className="text-sm font-medium">Outlook</h3>
                {outlookAccounts.length > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {outlookAccounts.length}
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md text-xs"
                onClick={() => {
                  window.location.href = "/api/email/outlook/auth";
                }}
              >
                <MailIcon className="size-3.5 mr-1.5" />
                Conectar Outlook
              </Button>
            </div>

            {outlookAccounts.length > 0 && (
              <div className="space-y-2 pl-5">
                {outlookAccounts.map((account) => (
                  <div
                    key={account._id}
                    className="flex items-center justify-between py-1.5 px-3 bg-muted/50 rounded-md"
                  >
                    <span className="text-sm text-foreground truncate">{account.email}</span>
                    <button
                      onClick={() => handleRemove(account._id, account.email)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Remover conta"
                    >
                      <Trash2Icon className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            Suas credenciais sao armazenadas de forma segura e usadas apenas para leitura dos
            e-mails. Ao responder, voce sera redirecionado para o app do provedor.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

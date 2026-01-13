"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteBudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId: Id<"budgets"> | null;
  budgetTitle: string;
}

export function DeleteBudgetDialog({
  isOpen,
  onClose,
  budgetId,
  budgetTitle,
}: DeleteBudgetDialogProps) {
  const deleteBudget = useMutation(api.budgets.deleteBudget);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!budgetId) return;

    setIsDeleting(true);
    try {
      await deleteBudget({ id: budgetId });
      toast.success("Orçamento excluído com sucesso!");
      onClose();
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Erro ao excluir orçamento");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <DialogTitle>Excluir Orçamento</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Tem certeza que deseja excluir o orçamento <strong>"{budgetTitle}"</strong>? Esta ação
            não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

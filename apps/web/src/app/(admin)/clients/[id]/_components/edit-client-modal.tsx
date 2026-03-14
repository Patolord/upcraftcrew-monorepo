"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import React from "react";

interface EditClientModalProps {
  client: Doc<"clients">;
  isOpen: boolean;
  onClose: () => void;
}

export function EditClientModal({ client, isOpen, onClose }: EditClientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateClient = useMutation(api.clients.updateClient);

  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email ?? "",
    phone: client.phone ?? "",
    company: client.company ?? "",
    notes: client.notes ?? "",
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email ?? "",
        phone: client.phone ?? "",
        company: client.company ?? "",
        notes: client.notes ?? "",
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateClient({
        id: client._id,
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });
      toast.success("Cliente atualizado com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome do cliente"
              required
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Nome da empresa"
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemplo.com"
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-9999"
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas sobre o cliente"
              rows={2}
              className="rounded-lg resize-none"
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  FolderOpenIcon,
  FileTextIcon,
  DollarSignIcon,
  KanbanIcon,
  CalendarIcon,
  Loader2Icon,
} from "lucide-react";
import { ClientDetailPanel } from "./client-detail-panel";
import { EditClientModal } from "./edit-client-modal";
import React from "react";

interface ClientProfileProps {
  clientId: Id<"clients">;
}

export function ClientProfile({ clientId }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState("projects");
  const [showEditModal, setShowEditModal] = useState(false);

  const clientWithRelations = useQuery(api.clients.getClientWithRelations, {
    id: clientId,
  });

  if (clientWithRelations === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2Icon className="size-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (clientWithRelations === null) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Cliente não encontrado</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/clients">Voltar para clientes</Link>
        </Button>
      </Card>
    );
  }

  const { projects, budgets, transactions, tasks, events } = clientWithRelations;

  return (
    <div className="p-4 md:p-6 md:pl-12 md:pr-12 space-y-6">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <ClientDetailPanel client={clientWithRelations} onEdit={() => setShowEditModal(true)} />

        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-fit border border-orange-100 rounded-lg mb-4">
              <TabsTrigger value="projects" className="gap-2">
                <FolderOpenIcon className="size-4" />
                Projetos ({projects.length})
              </TabsTrigger>
              <TabsTrigger value="budgets" className="gap-2">
                <FileTextIcon className="size-4" />
                Orçamentos ({budgets.length})
              </TabsTrigger>
              <TabsTrigger value="transactions" className="gap-2">
                <DollarSignIcon className="size-4" />
                Finanças ({transactions.length})
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-2">
                <KanbanIcon className="size-4" />
                Kanban ({tasks.length})
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <CalendarIcon className="size-4" />
                Agenda ({events.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Projetos</h3>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum projeto vinculado</p>
                  ) : (
                    <div className="space-y-2">
                      {projects.map((project) => (
                        <Link
                          key={project._id}
                          href={`/projects/${project._id}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <span className="font-medium">{project.name}</span>
                          <Badge variant="outline">{project.status}</Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="budgets">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Orçamentos</h3>
                </CardHeader>
                <CardContent>
                  {budgets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum orçamento vinculado</p>
                  ) : (
                    <div className="space-y-2">
                      {budgets.map((budget) => (
                        <Link
                          key={budget._id}
                          href={`/budgets/${budget._id}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <span className="font-medium">{budget.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {budget.totalAmount.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: budget.currency,
                              })}
                            </span>
                            <Badge variant="outline">{budget.status}</Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Transações</h3>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma transação vinculada</p>
                  ) : (
                    <div className="space-y-2">
                      {transactions.map((tx) => (
                        <div
                          key={tx._id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <span className="font-medium">{tx.description}</span>
                          <div className="flex items-center gap-2">
                            <span
                              className={tx.type === "income" ? "text-green-600" : "text-red-600"}
                            >
                              {tx.type === "income" ? "+" : "-"}
                              {tx.amount.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </span>
                            <Badge variant="outline">{tx.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Tarefas (Kanban)</h3>
                </CardHeader>
                <CardContent>
                  {tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma tarefa vinculada</p>
                  ) : (
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <Link
                          key={task._id}
                          href="/kanban"
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors block"
                        >
                          <span className="font-medium">{task.title}</span>
                          <Badge variant="outline">{task.status}</Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Eventos (Agenda)</h3>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum evento vinculado</p>
                  ) : (
                    <div className="space-y-2">
                      {events.map((event) => (
                        <div
                          key={event._id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <span className="font-medium">{event.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.startTime).toLocaleDateString("pt-BR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showEditModal && (
        <EditClientModal
          client={clientWithRelations}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

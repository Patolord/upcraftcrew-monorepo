"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/convex-errors";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  TagIcon,
  CalendarIcon,
  CheckSquareIcon,
  UsersIcon,
  AlignLeftIcon,
  TrashIcon,
  MoreHorizontalIcon,
  SendIcon,
  CircleIcon,
  MessageSquareIcon,
  ImageIcon,
  Lock,
  Globe,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";
import React from "react";

type TaskPriority = "low" | "medium" | "high" | "urgent";

interface TaskDetailModalProps {
  taskId: Id<"tasks"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LABEL_COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Yellow", value: "#eab308" },
  { name: "Lime", value: "#84cc16" },
  { name: "Green", value: "#22c55e" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
];

const priorityLabels: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Baixa", color: "#84cc16" },
  medium: { label: "Média", color: "#f59e0b" },
  high: { label: "Alta", color: "#f97316" },
  urgent: { label: "Urgente", color: "#ef4444" },
};

export function TaskDetailModal({ taskId, open, onOpenChange }: TaskDetailModalProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0].value);
  const [showLabelCreator, setShowLabelCreator] = useState(false);
  const [showLabelPanel, setShowLabelPanel] = useState(false);

  // Queries
  const task = useQuery(api.tasks.getTaskById, taskId ? { id: taskId } : "skip");
  const subtasks = useQuery(api.subtasks.getSubtasksByTask, taskId ? { taskId } : "skip");
  const comments = useQuery(api.taskComments.getCommentsByTask, taskId ? { taskId } : "skip");
  const labels = useQuery(api.taskLabels.getLabels);
  const teamMembers = useQuery(api.team.getTeamMembers);

  // Mutations
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const createSubtask = useMutation(api.subtasks.createSubtask);
  const toggleSubtask = useMutation(api.subtasks.toggleSubtask);
  const deleteSubtask = useMutation(api.subtasks.deleteSubtask);
  const createComment = useMutation(api.taskComments.createComment);
  const deleteComment = useMutation(api.taskComments.deleteComment);
  const createLabel = useMutation(api.taskLabels.createLabel);

  // Sync edited values when task loads
  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description);
    }
  }, [task]);

  if (!taskId || !task) return null;

  const subtaskProgress = subtasks
    ? subtasks.length > 0
      ? Math.round((subtasks.filter((s) => s.completed).length / subtasks.length) * 100)
      : 0
    : 0;

  const handleUpdateTitle = async () => {
    if (!editedTitle.trim()) return;
    try {
      await updateTask({ id: taskId, title: editedTitle });
      setIsEditingTitle(false);
      toast.success("Title updated!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdateDescription = async () => {
    try {
      await updateTask({ id: taskId, description: editedDescription });
      toast.success("Description updated!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdateImages = async (imageUrls: string[]) => {
    try {
      await updateTask({ id: taskId, imageUrls: imageUrls.length > 0 ? imageUrls : undefined });
      toast.success("Imagens atualizadas!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdatePriority = async (priority: TaskPriority) => {
    try {
      await updateTask({ id: taskId, priority });
      toast.success("Priority updated!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleToggleAssignee = async (userId: string) => {
    const currentIds = task.assignedToIds ?? (task.assignedTo ? [task.assignedTo] : []);
    const isAssigned = currentIds.includes(userId as Id<"users">);
    const newIds = isAssigned
      ? currentIds.filter((id) => id !== userId)
      : [...currentIds, userId as Id<"users">];
    try {
      await updateTask({ id: taskId, assignedToIds: newIds });
      toast.success(isAssigned ? "Membro removido!" : "Membro atribuído!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdatePrivacy = async (isPrivate: boolean) => {
    try {
      await updateTask({ id: taskId, isPrivate });
      toast.success(isPrivate ? "Tarefa agora é privada" : "Tarefa agora é pública");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    try {
      await createSubtask({ taskId, title: newSubtaskTitle });
      setNewSubtaskTitle("");
      setShowSubtaskInput(false);
      toast.success("Subtask added!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleToggleSubtask = async (subtaskId: Id<"subtasks">) => {
    try {
      await toggleSubtask({ id: subtaskId });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteSubtask = async (subtaskId: Id<"subtasks">) => {
    try {
      await deleteSubtask({ id: subtaskId });
      toast.success("Subtask deleted!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment({ taskId, content: newComment });
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteComment = async (commentId: Id<"taskComments">) => {
    try {
      await deleteComment({ id: commentId });
      toast.success("Comment deleted!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;
    try {
      const labelId = await createLabel({ name: newLabelName, color: newLabelColor });
      // Add label to task
      const currentLabelIds = task.labelIds || [];
      await updateTask({ id: taskId, labelIds: [...currentLabelIds, labelId] });
      setNewLabelName("");
      setShowLabelCreator(false);
      toast.success("Label created and added!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleToggleLabel = async (labelId: Id<"taskLabels">) => {
    const currentLabelIds = task.labelIds || [];
    const hasLabel = currentLabelIds.includes(labelId);
    try {
      await updateTask({
        id: taskId,
        labelIds: hasLabel
          ? currentLabelIds.filter((id) => id !== labelId)
          : [...currentLabelIds, labelId],
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask({ id: taskId });
      onOpenChange(false);
      toast.success("Task deleted!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-admin-background rounded-lg shadow-sm overflow-y-auto p-0"
        style={{ width: "60vw", maxWidth: "none" }}
      >
        {/* Header */}
        <SheetHeader className="p-4 pb-0">
          <div className="flex items-center gap-2 text-xs text-brand mb-2">
            <CircleIcon className="size-3" />
            <span>{task.status.replace("-", " ").toUpperCase()}</span>
          </div>
          {isEditingTitle ? (
            <div className="flex gap-2">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdateTitle()}
                autoFocus
                className="text-lg font-semibold"
              />
              <Button size="sm" onClick={handleUpdateTitle}>
                Salvar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditingTitle(false)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <SheetTitle
              className="text-xl font-semibold cursor-pointer hover:text-primary"
              onClick={() => setIsEditingTitle(true)}
            >
              {task.title}
            </SheetTitle>
          )}
        </SheetHeader>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-2 p-4 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md border-brand bg-admin-background"
              >
                <PlusIcon className="size-4 mr-1 text-brand" /> Adicionar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowSubtaskInput(true)}>
                <CheckSquareIcon className="size-4 mr-2 text-brand" /> Subtarefa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-md border-brand bg-admin-background"
              onClick={() => setShowLabelPanel(!showLabelPanel)}
            >
              <TagIcon className="size-4 mr-1 text-brand" /> Labels
            </Button>
            {showLabelPanel && (
              <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-md border bg-popover p-1 shadow-md">
                {labels?.map((label) => (
                  <button
                    key={label._id}
                    onClick={() => handleToggleLabel(label._id)}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                  >
                    <div className="size-4 rounded" style={{ backgroundColor: label.color }} />
                    <span>{label.name}</span>
                    {task.labelIds?.includes(label._id) && (
                      <span className="ml-auto text-green-500">✓</span>
                    )}
                  </button>
                ))}
                <Separator className="my-1" />
                {showLabelCreator ? (
                  <div className="p-2 space-y-2">
                    <Input
                      placeholder="Label name"
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateLabel();
                        }
                      }}
                      autoFocus
                      className="h-8"
                    />
                    <div className="flex flex-wrap gap-1">
                      {LABEL_COLORS.map((color) => (
                        <button
                          key={color.value}
                          className={`size-5 rounded cursor-pointer ${newLabelColor === color.value ? "ring-2 ring-offset-1 ring-primary" : ""}`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setNewLabelColor(color.value)}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" className="flex-1" onClick={handleCreateLabel}>
                        Criar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowLabelCreator(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLabelCreator(true)}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                  >
                    <PlusIcon className="size-4" /> Criar nova label
                  </button>
                )}
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md border-brand bg-admin-background"
              >
                <CalendarIcon className="size-4 mr-1 text-brand" /> Datas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="p-2">
                <Input
                  type="date"
                  onChange={async (e) => {
                    if (e.target.value) {
                      try {
                        await updateTask({
                          id: taskId,
                          dueDate: new Date(e.target.value).getTime(),
                        });
                        toast.success("Due date updated!");
                      } catch (error) {
                        toast.error(getErrorMessage(error));
                      }
                    }
                  }}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="rounded-md border-brand bg-admin-background"
            onClick={() => setShowSubtaskInput(true)}
          >
            <CheckSquareIcon className="size-4 mr-1 text-brand" /> Checklist
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md border-brand bg-admin-background"
              >
                <UsersIcon className="size-4 mr-1 text-brand" /> Atribuir para
                {(task.assignedUsers?.length ?? 0) > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
                    {task.assignedUsers?.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {teamMembers?.map((member) => {
                const assignedIds =
                  task.assignedToIds ?? (task.assignedTo ? [task.assignedTo] : []);
                const isAssigned = assignedIds.includes(member._id);
                return (
                  <DropdownMenuItem
                    key={member._id}
                    onClick={() => handleToggleAssignee(member._id)}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="size-6">
                      <AvatarImage src={member.imageUrl} />
                      <AvatarFallback className="text-xs">
                        {member.firstName?.[0]}
                        {member.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1">
                      {member.firstName} {member.lastName}
                    </span>
                    {isAssigned && <span className="text-green-500">✓</span>}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Privacy Toggle */}
          <div className="flex items-center gap-2 ml-auto px-3 py-1.5 rounded-md border border-brand bg-admin-background">
            {task.isPrivate ? (
              <Lock className="size-4 text-orange-500" />
            ) : (
              <Globe className="size-4 text-green-500" />
            )}
            <Label htmlFor="privacy-toggle" className="text-xs cursor-pointer">
              {task.isPrivate ? "Privada" : "Pública"}
            </Label>
            <Switch
              id="privacy-toggle"
              checked={task.isPrivate ?? false}
              onCheckedChange={handleUpdatePrivacy}
              className="scale-75"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-5 gap-4 p-4">
          {/* Left Column - Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Labels Display */}
            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.labels.map((label) => (
                  <Badge
                    key={label?._id}
                    style={{ backgroundColor: label?.color }}
                    className="text-white"
                  >
                    {label?.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Priority */}
            <div className="space-y-2 p-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <TagIcon className="size-4 text-brand" /> Prioridade
              </h4>
              <Select
                value={task.priority}
                onValueChange={(value) => handleUpdatePriority(value as TaskPriority)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLabels).map(([key, { label, color }]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded" style={{ backgroundColor: color }} />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2 p-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <AlignLeftIcon className="size-4 text-brand" /> Descrição
              </h4>
              <Textarea
                placeholder="Adicione uma descrição mais detalhada..."
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onBlur={handleUpdateDescription}
                className="min-h-24 rounded-md p-2"
              />
            </div>

            {/* Subtasks/Checklist */}
            <div className="space-y-3 p-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <CheckSquareIcon className="size-4 text-brand" /> Checklist
                </h4>
                <Button variant="ghost" size="sm" onClick={() => setShowSubtaskInput(true)}>
                  <PlusIcon className="size-4 text-brand" />
                </Button>
              </div>

              {subtasks && subtasks.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{subtaskProgress}%</span>
                    <Progress value={subtaskProgress} className="flex-1" />
                  </div>

                  <div className="space-y-2">
                    {subtasks.map((subtask) => (
                      <div key={subtask._id} className="flex items-center gap-2 group">
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={() => handleToggleSubtask(subtask._id)}
                          className="data-checked:bg-white data-checked:text-brand data-checked:border-brand border-brand rounded-xs"
                        />
                        <span
                          className={`flex-1 text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {subtask.title}
                        </span>

                        {/* Delete Subtask */}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-0 group-hover:opacity-100"
                          onClick={() => handleDeleteSubtask(subtask._id)}
                        >
                          <TrashIcon className="size-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {showSubtaskInput && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicione um item..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleAddSubtask}>
                    Adicionar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowSubtaskInput(false);
                      setNewSubtaskTitle("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}

              {(!subtasks || subtasks.length === 0) && !showSubtaskInput && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowSubtaskInput(true)}
                >
                  <PlusIcon className="size-4 mr-1 text-brand" /> Adicionar um item
                </Button>
              )}
            </div>

            {/* Images/Attachments */}
            <div className="space-y-2 p-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="size-4 text-brand" /> Fotos / Anexos
              </h4>
              <MultiImageUpload
                value={task.imageUrls || (task.imageUrl ? [task.imageUrl] : [])}
                onChange={handleUpdateImages}
                folder="tasks"
                maxImages={10}
              />
            </div>
          </div>

          {/* Right Column - Comments & Activity */}
          <div className="md:col-span-2 space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <MessageSquareIcon className="size-4 text-brand" /> Comentários e atividades
              </h4>
            </div>

            {/* Comment Input */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Escreva um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-16 rounded-md p-2"
              />
            </div>
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="w-full rounded-md border-brand bg-white text-brand hover:bg-brand hover:text-white"
            >
              <SendIcon className="size-4 mr-1 text-brand" /> Enviar
            </Button>

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments?.map((comment) => (
                <div key={comment._id} className="space-y-1 group">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={comment.user?.imageUrl} />
                      <AvatarFallback className="text-xs">
                        {comment.user?.firstName?.[0]}
                        {comment.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="ml-auto opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontalIcon className="size-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <TrashIcon className="size-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm pl-8">{comment.content}</p>
                </div>
              ))}

              {(!comments || comments.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Delete */}
        <div className="border-t p-4 mt-auto">
          <div className="flex items-center justify-between">
            {task.assignedUsers && task.assignedUsers.length > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {task.assignedUsers.slice(0, 4).map((user) =>
                    user ? (
                      <Avatar key={user._id} className="size-8 border-2 border-background">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback className="text-xs bg-linear-to-br from-orange-400 to-pink-500 text-white">
                          {user.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    ) : null,
                  )}
                  {task.assignedUsers.length > 4 && (
                    <Avatar className="size-8 border-2 border-background">
                      <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                        +{task.assignedUsers.length - 4}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {task.assignedUsers.length === 1
                      ? task.assignedUsers[0]?.name
                      : `${task.assignedUsers.length} membros`}
                  </p>
                  <p className="text-xs text-muted-foreground">Atribuídos</p>
                </div>
              </div>
            ) : (
              <span />
            )}
            <Button variant="destructive" size="sm" onClick={handleDeleteTask}>
              <TrashIcon className="size-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

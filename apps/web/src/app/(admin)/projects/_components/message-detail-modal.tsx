"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PinIcon, Loader2Icon, Trash2Icon, SendIcon } from "lucide-react";
import { toast } from "sonner";

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface MessageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: Id<"messages">;
  currentUserId: Id<"users">;
  currentUserRole: string;
  projectManagerId: Id<"users">;
}

export function MessageDetailModal({
  isOpen,
  onClose,
  messageId,
  currentUserId,
  currentUserRole,
  projectManagerId,
}: MessageDetailModalProps) {
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const message = useQuery(api.messages.getMessageById, { messageId });
  const replies = useQuery(api.messages.getRepliesByMessage, { messageId });
  const createReply = useMutation(api.messages.createReply);
  const pinMessage = useMutation(api.messages.pinMessage);
  const deleteReply = useMutation(api.messages.deleteReply);

  const isAdmin = currentUserRole === "admin";
  const canPin = isAdmin || currentUserId === projectManagerId;

  const handleSendReply = async () => {
    if (!replyContent.trim() || message === undefined || message === null) return;

    setIsSending(true);
    try {
      await createReply({ messageId, content: replyContent.trim() });
      setReplyContent("");
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };

  const handlePin = async () => {
    if (message === undefined || message === null) return;
    try {
      await pinMessage({ id: messageId, isPinned: !message.isPinned });
      toast.success(message.isPinned ? "Message unpinned" : "Message pinned");
    } catch {
      toast.error("Failed to update pin");
    }
  };

  const handleDeleteReply = async (replyId: Id<"messageReplies">) => {
    try {
      await deleteReply({ id: replyId });
    } catch {
      toast.error("Failed to delete reply");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col rounded-xl">
        {message === undefined ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2Icon className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-sm text-muted-foreground">Loading message…</p>
          </div>
        ) : message === null ? (
          <div className="flex flex-col items-center gap-4 py-10 px-2 text-center">
            <DialogHeader className="w-full">
              <DialogTitle>Message not found</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This message may have been deleted or you no longer have access.
            </p>
            <Button type="button" onClick={onClose} className="bg-orange-500 hover:bg-orange-600 rounded-lg">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-2 pr-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {message.isPinned && <PinIcon className="h-4 w-4 text-orange-500 shrink-0" />}
                    <DialogTitle className="text-lg leading-tight">{message.title}</DialogTitle>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {message.author
                      ? `${message.author.firstName} ${message.author.lastName}`
                      : "Unknown"}{" "}
                    · {timeAgo(message.createdAt)}
                  </p>
                </div>
                {canPin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void handlePin()}
                    className="shrink-0 text-muted-foreground hover:text-orange-500"
                  >
                    <PinIcon className="h-4 w-4" />
                    {message.isPinned ? "Unpin" : "Pin"}
                  </Button>
                )}
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap border-b pb-4">
                {message.content}
              </div>

              <div className="space-y-3">
                {replies === undefined ? (
                  <div className="flex justify-center py-4">
                    <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : replies.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No replies yet. Be the first to reply!
                  </p>
                ) : (
                  replies.map((reply) => (
                    <div key={reply._id} className="flex gap-3 group">
                      <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {reply.author
                              ? `${reply.author.firstName} ${reply.author.lastName}`
                              : "Unknown"}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {timeAgo(reply.createdAt)}
                            </span>
                            {reply.authorId === currentUserId && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500"
                                onClick={() => handleDeleteReply(reply._id)}
                              >
                                <Trash2Icon className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="rounded-lg resize-none flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    void handleSendReply();
                  }
                }}
              />
              <Button
                onClick={() => void handleSendReply()}
                disabled={isSending || !replyContent.trim()}
                className="self-end bg-orange-500 hover:bg-orange-600 rounded-lg"
              >
                {isSending ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PinIcon, MessageSquareIcon, Trash2Icon } from "lucide-react";

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

interface MessageCardProps {
  message: {
    _id: Id<"messages">;
    title: string;
    content: string;
    isPinned?: boolean;
    createdAt: number;
    authorId: Id<"users">;
    replyCount: number;
    author: {
      _id: Id<"users">;
      firstName: string;
      lastName: string;
      imageUrl?: string;
    } | null;
  };
  currentUserId: Id<"users">;
  currentUserRole: string;
  onClick: () => void;
  onDelete: (id: Id<"messages">) => void;
}

export function MessageCard({
  message,
  currentUserId,
  currentUserRole,
  onClick,
  onDelete,
}: MessageCardProps) {
  const canDelete = message.authorId === currentUserId || currentUserRole === "admin";
  const preview = message.content.length > 150 ? message.content.slice(0, 150) + "…" : message.content;

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {message.isPinned && <PinIcon className="h-3.5 w-3.5 text-orange-500 shrink-0" />}
            <h3 className="font-medium text-sm truncate">{message.title}</h3>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{preview}</p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              {message.author
                ? `${message.author.firstName} ${message.author.lastName}`
                : "Unknown"}
            </span>
            <span>·</span>
            <span>{timeAgo(message.createdAt)}</span>
            <Badge variant="secondary" className="flex items-center gap-1 px-1.5 py-0">
              <MessageSquareIcon className="h-3 w-3" />
              {message.replyCount}
            </Badge>
          </div>
        </div>

        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(message._id);
            }}
          >
            <Trash2Icon className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
}

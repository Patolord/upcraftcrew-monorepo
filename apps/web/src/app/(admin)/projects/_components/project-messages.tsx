"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquareIcon, PlusIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { MessageCard } from "./message-card";
import { NewMessageModal } from "./new-message-modal";
import { MessageDetailModal } from "./message-detail-modal";

interface ProjectMessagesProps {
  projectId: Id<"projects">;
  projectManagerId: Id<"users">;
  currentUser: {
    _id: Id<"users">;
    role: string;
  };
}

export function ProjectMessages({ projectId, projectManagerId, currentUser }: ProjectMessagesProps) {
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<Id<"messages"> | null>(null);

  const messages = useQuery(api.messages.getMessagesByProject, { projectId });
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const handleDelete = async (id: Id<"messages">) => {
    try {
      await deleteMessage({ id });
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  };

  if (messages === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2Icon className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Sort: pinned first, then by createdAt desc
  const sorted = [...messages].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Message Board</h2>
        <Button
          onClick={() => setShowNewModal(true)}
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 rounded-lg gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          New Message
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={MessageSquareIcon}
          title="No messages yet"
          description="Post the first message to start a conversation with your team."
          action={
            <Button
              onClick={() => setShowNewModal(true)}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Message
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              currentUserId={currentUser._id}
              currentUserRole={currentUser.role}
              onClick={() => setSelectedMessageId(message._id)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <NewMessageModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        projectId={projectId}
      />

      {selectedMessageId && (
        <MessageDetailModal
          isOpen={true}
          onClose={() => setSelectedMessageId(null)}
          messageId={selectedMessageId}
          currentUserId={currentUser._id}
          currentUserRole={currentUser.role}
          projectManagerId={projectManagerId}
        />
      )}
    </div>
  );
}

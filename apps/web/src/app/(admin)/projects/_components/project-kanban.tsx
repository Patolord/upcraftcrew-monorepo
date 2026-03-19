"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { PlusIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/convex-errors";
import { TaskCard } from "../../kanban/_components/kanban-task-card";
import { NewTaskModal } from "../../kanban/_components/new-task-modal";
import { TaskDetailModal } from "../../kanban/_components/task-detail-modal";

type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";

interface TaskLabel {
  _id: Id<"taskLabels">;
  name: string;
  color: string;
}

interface Task {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "urgent";
  assignedUsers: {
    _id: string;
    name: string;
    imageUrl?: string;
  }[];
  project: {
    _id: string;
    name: string;
  } | null;
  dueDate?: number;
  labels?: TaskLabel[];
  subtaskStats?: {
    total: number;
    completed: number;
  };
  commentCount?: number;
}

interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

interface ProjectKanbanProps {
  projectId: Id<"projects">;
}

// Draggable Task Card Component
interface DraggableTaskCardProps {
  task: Task;
  onClick?: () => void;
}

function DraggableTaskCard({ task, onClick }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle click separately from drag
  const handleClick = () => {
    if (!isDragging && onClick) {
      onClick();
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={handleClick}>
      <TaskCard task={task} />
    </div>
  );
}

// Column header colors based on status
const columnStyles: Record<TaskStatus, { bg: string; text: string; badge: string }> = {
  todo: {
    bg: "bg-blue-500",
    text: "text-white",
    badge: "bg-blue-600/30 text-white",
  },
  "in-progress": {
    bg: "bg-violet-500",
    text: "text-white",
    badge: "bg-violet-600/30 text-white",
  },
  review: {
    bg: "bg-orange-500",
    text: "text-white",
    badge: "bg-orange-600/30 text-white",
  },
  done: {
    bg: "bg-emerald-500",
    text: "text-white",
    badge: "bg-emerald-600/30 text-white",
  },
  blocked: {
    bg: "bg-red-500",
    text: "text-white",
    badge: "bg-red-600/30 text-white",
  },
};

// Droppable Column Component
interface DroppableColumnProps {
  column: Column;
  onTaskClick?: (taskId: Id<"tasks">) => void;
  onAddTask?: () => void;
}

function DroppableColumn({ column, onTaskClick, onAddTask }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  const style = columnStyles[column.id];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-2xl transition-all duration-200",
        isOver && "ring-2 ring-primary ring-offset-2",
      )}
    >
      {/* Column Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-2xl",
          style.bg,
          style.text,
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center justify-center size-6 text-xs font-bold rounded-full",
              style.badge,
            )}
          >
            {column.tasks.length}
          </span>
          <h3 className="font-semibold text-sm">{column.title}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-white/80 hover:text-white hover:bg-white/20"
          onClick={onAddTask}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>

      {/* Column Content - Droppable area */}
      <div className="pt-4 pb-2 flex flex-col">
        <SortableContext
          items={column.tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-400px)] pr-1">
            {column.tasks.length === 0 ? (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-muted-foreground/20 rounded-xl text-muted-foreground mx-1">
                <p className="text-xs">No tasks yet</p>
              </div>
            ) : (
              column.tasks.map((task) => (
                <DraggableTaskCard
                  key={task._id}
                  task={task}
                  onClick={() => onTaskClick?.(task._id)}
                />
              ))
            )}
          </div>
        </SortableContext>

        {/* Add Task Button at bottom */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 shrink-0 text-muted-foreground hover:text-foreground justify-start"
          onClick={onAddTask}
        >
          <PlusIcon className="size-4 mr-2" />
          Add a task
        </Button>
      </div>
    </div>
  );
}

export function ProjectKanban({ projectId }: ProjectKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Modal states
  const [selectedTaskId, setSelectedTaskId] = useState<Id<"tasks"> | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskDefaultStatus, setNewTaskDefaultStatus] = useState<TaskStatus>("todo");

  // Fetch tasks for this project
  const tasksData = useQuery(api.tasks.getTasksByProject, { projectId });
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);

  // Transform tasks to match the expected interface
  const tasks = useMemo<Task[]>(() => {
    if (!tasksData) return [];
    return tasksData.map(
      (task): Task => ({
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedUsers: (task.assignedUsers ?? []).map((u) => ({
          _id: u._id,
          name: u.name,
          imageUrl: u.imageUrl,
        })),
        project: task.project
          ? {
              _id: task.project._id,
              name: task.project.name,
            }
          : null,
        dueDate: task.dueDate,
        labels: task.labels
          ?.filter((label) => label !== null)
          .map((label) => ({ _id: label._id, name: label.name, color: label.color })),
        subtaskStats: task.subtaskStats,
        commentCount: task.commentCount,
      }),
    );
  }, [tasksData]);

  // Group tasks by status
  const columns = useMemo<Column[]>(() => {
    const statuses: { id: TaskStatus; title: string }[] = [
      { id: "todo", title: "Para Fazer" },
      { id: "in-progress", title: "Em Progresso" },
      { id: "review", title: "Revisão" },
      { id: "done", title: "Concluído" },
    ];

    return statuses.map(
      (status): Column => ({
        id: status.id,
        title: status.title,
        tasks: tasks.filter((task) => task.status === status.id),
      }),
    );
  }, [tasks]);

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Find the active task
    const activeTask = tasks.find((task) => task._id === active.id);

    // Extract the column id from the droppable id
    let targetStatus: TaskStatus | null = null;
    const overId = over.id.toString();

    // Check if dropped over a column
    if (overId.startsWith("column-")) {
      targetStatus = overId.replace("column-", "") as TaskStatus;
    } else {
      // Dropped over another task, find which column it belongs to
      const overTask = tasks.find((task) => task._id === over.id);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (activeTask && targetStatus && activeTask.status !== targetStatus) {
      try {
        await updateTaskStatus({
          id: activeTask._id,
          status: targetStatus,
        });
        toast.success("Task atualizada!");
      } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
      }
    }
  };

  // Handlers
  const handleTaskClick = (taskId: Id<"tasks">) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailOpen(true);
  };

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskDefaultStatus(status);
    setIsNewTaskOpen(true);
  };

  const handleNewTaskOpenChange = (open: boolean) => {
    setIsNewTaskOpen(open);
    if (!open) {
      setNewTaskDefaultStatus("todo");
    }
  };

  const handleTaskDetailOpenChange = (open: boolean) => {
    setIsTaskDetailOpen(open);
    if (!open) {
      setSelectedTaskId(null);
    }
  };

  // Loading state
  if (tasksData === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  // Find active task for drag overlay
  const activeTask = tasks.find((task) => task._id === activeId);

  return (
    <div className="p-6 space-y-6">
      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-4">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              column={column}
              onTaskClick={handleTaskClick}
              onAddTask={() => handleAddTask(column.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId && activeTask ? (
            <div className="cursor-move rotate-3 scale-105">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        open={isTaskDetailOpen}
        onOpenChange={handleTaskDetailOpenChange}
      />

      {/* New Task Modal */}
      <NewTaskModal
        open={isNewTaskOpen}
        onOpenChange={handleNewTaskOpenChange}
        defaultStatus={newTaskDefaultStatus}
        defaultProjectId={projectId}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Sortable from "sortablejs";
import type { Project, ProjectStatus } from "@/types/project";
import { KanbanColumn } from "./KanbanColumn";

interface Column {
  id: ProjectStatus;
  title: string;
  projects: Project[];
}

interface KanbanBoardProps {
  columns: Column[];
}

export function KanbanBoard({ columns }: KanbanBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    // Initialize drag and drop for columns
    const columnElements = boardRef.current.querySelectorAll(".kanban-column-content");
    const sortables: Sortable[] = [];

    columnElements.forEach((columnElement) => {
      const sortable = Sortable.create(columnElement as HTMLElement, {
        group: "kanban",
        animation: 150,
        ghostClass: "opacity-30",
        dragClass: "rotate-2",
        chosenClass: "shadow-lg",
        handle: ".kanban-card",
        onEnd: (evt) => {
          // Here you would typically update the backend
          console.log("Card moved:", {
            from: evt.from.dataset.columnId,
            to: evt.to.dataset.columnId,
            oldIndex: evt.oldIndex,
            newIndex: evt.newIndex,
          });
        },
      });
      sortables.push(sortable);
    });

    return () => {
      sortables.forEach((s) => s.destroy());
    };
  }, [columns]);

  return (
    <div ref={boardRef} className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <KanbanColumn key={column.id} column={column} />
      ))}
    </div>
  );
}

import AppShell from "@/components/layout/app-shell";
import { BoardHeader } from "@/components/board/board-header";
import { KanbanBoard } from "@/components/board/kanban-board";

export default function ProjectPage() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <BoardHeader />
        <KanbanBoard />
      </div>
    </AppShell>
  );
}

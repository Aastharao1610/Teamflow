"use client";

import { useState } from "react";
import { CheckSquare, Plus } from "lucide-react";
import { Task, TaskCard } from "./task-card";
import { TaskDetailDrawer } from "./task-detail-drawer";

const tasks: Task[] = [
  {
    id: "TF-101",
    title: "Create Task API",
    description: "Implement task creation and validation.",
    priority: "HIGH",
    status: "TODO",
    assignee: "Alex",
    dueDate: "Sep 12",
    comments: 3,
  },
  {
    id: "TF-102",
    title: "Implement authentication",
    description: "Connect login and signup flows.",
    priority: "URGENT",
    status: "TODO",
    assignee: "Sarah",
    dueDate: "Sep 10",
    comments: 5,
  },
  {
    id: "TF-103",
    title: "Workspace testing",
    description: "Finish endpoint tests for workspace.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assignee: "Alex",
    dueDate: "Sep 11",
    comments: 2,
  },
  {
    id: "TF-104",
    title: "Project module",
    description: "Complete project member management.",
    priority: "MEDIUM",
    status: "REVIEW",
    assignee: "Mike",
    dueDate: "Sep 13",
    comments: 4,
  },
  {
    id: "TF-105",
    title: "Organization module",
    description: "Organization CRUD and member management.",
    priority: "LOW",
    status: "DONE",
    assignee: "Alex",
    comments: 1,
  },
  {
    id: "TF-106",
    title: "Auth module",
    description: "Authentication and authorization.",
    priority: "HIGH",
    status: "DONE",
    assignee: "Sarah",
    comments: 7,
  },
];

const columns = [
  {
    id: "TODO",
    title: "Todo",
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
  },
  {
    id: "REVIEW",
    title: "Review",
  },
  {
    id: "DONE",
    title: "Done",
  },
] as const;

export function KanbanBoard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const hasTasks = tasks.length > 0;

  return (
    <>
      <div className="flex-1 overflow-auto bg-zinc-100 p-4 sm:p-6">
        {!hasTasks ? (
          /* Empty project state */
          <div className="flex min-h-full items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
              {/* Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
                <CheckSquare size={26} strokeWidth={1.7} />
              </div>

              {/* Content */}
              <h2 className="mt-5 text-lg font-semibold tracking-tight text-zinc-950">
                No tasks yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                This project doesn&apos;t have any tasks yet. Create your first
                task to start planning and tracking your work.
              </p>

              {/* Action */}
              <button
                type="button"
                className="mx-auto mt-6 flex h-10 items-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                <Plus size={16} />
                Create your first task
              </button>
            </div>
          </div>
        ) : (
          /* Kanban board */
          <div className="flex min-w-max gap-4 sm:gap-5">
            {columns.map((column) => {
              const columnTasks = tasks.filter(
                (task) => task.status === column.id,
              );

              return (
                <div
                  key={column.id}
                  className="flex min-h-[450px] w-[280px] shrink-0 flex-col rounded-xl bg-zinc-50/80 p-3 sm:w-[300px]"
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between px-2 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-800">
                        {column.title}
                      </span>

                      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                        {columnTasks.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="rounded-md p-1 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-800"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* Tasks */}
                  <div className="mt-2 flex flex-1 flex-col gap-3">
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={setSelectedTask}
                      />
                    ))}

                    {columnTasks.length === 0 && (
                      <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-zinc-200 text-xs text-zinc-400">
                        No tasks
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="mt-3 flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                  >
                    <Plus size={14} />
                    Add task
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TaskDetailDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </>
  );
}

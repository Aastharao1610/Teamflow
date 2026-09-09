"use client";

import { CalendarDays, MessageCircle, MoreHorizontal } from "lucide-react";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  assignee?: string;
  dueDate?: string;
  comments: number;
};

type TaskCardProps = {
  task: Task;
  onClick: (task: Task) => void;
};

const priorityStyles = {
  LOW: "bg-zinc-100 text-zinc-600",
  MEDIUM: "bg-yellow-50 text-yellow-700",
  HIGH: "bg-orange-50 text-orange-700",
  URGENT: "bg-red-50 text-red-700",
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <button
      onClick={() => onClick(task)}
      className="group w-full rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-md px-2 py-1 text-[10px] font-semibold ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>

        <span
          onClick={(event) => event.stopPropagation()}
          className="rounded-md p-1 text-zinc-300 opacity-0 transition hover:bg-zinc-100 hover:text-zinc-600 group-hover:opacity-100"
        >
          <MoreHorizontal size={16} />
        </span>
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-5 text-zinc-900">
        {task.title}
      </h3>

      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-zinc-500">
        {task.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.assignee ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-semibold text-white">
              {task.assignee.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-zinc-300 text-zinc-400">
              +
            </div>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-400">
              <CalendarDays size={12} />
              {task.dueDate}
            </div>
          )}
        </div>

        {task.comments > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-zinc-400">
            <MessageCircle size={12} />
            {task.comments}
          </div>
        )}
      </div>
    </button>
  );
}

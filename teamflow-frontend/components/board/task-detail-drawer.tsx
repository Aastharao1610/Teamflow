"use client";

import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  MessageCircle,
  User,
  X,
} from "lucide-react";
import { Task } from "./task-card";

type TaskDetailDrawerProps = {
  task: Task | null;
  onClose: () => void;
};

export function TaskDetailDrawer({ task, onClose }: TaskDetailDrawerProps) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        aria-label="Close task details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/20 backdrop-blur-[1px]"
      />

      {/* Drawer */}
      <aside className="relative flex h-full w-full flex-col bg-white shadow-2xl sm:max-w-[520px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-500">
              TASK
            </span>

            <span className="text-xs text-zinc-400">#{task.id}</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-7">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {task.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {task.description}
            </p>

            {/* Properties */}
            <div className="mt-8 divide-y divide-zinc-100 rounded-xl border border-zinc-200">
              <Property icon={<Circle size={16} />} label="Status">
                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  {task.status.replace("_", " ")}
                </span>
              </Property>

              <Property icon={<CheckCircle2 size={16} />} label="Priority">
                <span className="text-xs font-medium">{task.priority}</span>
              </Property>

              <Property icon={<User size={16} />} label="Assignee">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-semibold text-white">
                    {task.assignee?.charAt(0).toUpperCase() ?? "?"}
                  </div>

                  <span className="text-xs font-medium">
                    {task.assignee ?? "Unassigned"}
                  </span>
                </div>
              </Property>

              <Property icon={<CalendarDays size={16} />} label="Due date">
                <span className="text-xs font-medium">
                  {task.dueDate ?? "No due date"}
                </span>
              </Property>
            </div>

            {/* Activity */}
            <div className="mt-10">
              <div className="mb-5 flex items-center gap-2">
                <Clock3 size={16} className="text-zinc-400" />

                <h3 className="text-sm font-semibold">Activity</h3>
              </div>

              <div className="space-y-5">
                <ActivityItem text="Task created" time="Today, 10:32 AM" />

                <ActivityItem
                  text="Priority changed to HIGH"
                  time="Today, 10:45 AM"
                />

                <ActivityItem text="Assigned to Alex" time="Today, 11:02 AM" />
              </div>
            </div>

            {/* Comments */}
            <div className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-zinc-400" />

                  <h3 className="text-sm font-semibold">Comments</h3>
                </div>

                <span className="text-xs text-zinc-400">{task.comments}</span>
              </div>

              <div className="rounded-xl border border-zinc-200 p-4">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-semibold">
                    A
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">Alex</span>

                      <span className="text-[10px] text-zinc-400">
                        10 min ago
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      Let&apos;s make sure this is ready before the next review.
                    </p>
                  </div>
                </div>
              </div>

              <textarea
                placeholder="Write a comment..."
                className="mt-3 min-h-[90px] w-full resize-none rounded-xl border border-zinc-200 p-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
              />

              <button className="mt-2 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800">
                Add comment
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Property({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-14 items-center justify-between px-4">
      <div className="flex items-center gap-3 text-zinc-400">
        {icon}

        <span className="text-xs text-zinc-500">{label}</span>
      </div>

      {children}
    </div>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-300" />

      <div>
        <p className="text-xs font-medium text-zinc-700">{text}</p>

        <p className="mt-1 text-[10px] text-zinc-400">{time}</p>
      </div>
    </div>
  );
}

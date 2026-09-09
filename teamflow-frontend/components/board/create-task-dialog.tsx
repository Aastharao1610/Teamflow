"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown, Flag, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CreateTaskDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateTaskDialog({ open, onClose }: CreateTaskDialogProps) {
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("TODO");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  function handleCreateTask() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a task title.");
      return;
    }

    setError("");

    showToast(
      "success",
      "Task created",
      `"${trimmedTitle}" was added to this project.`,
    );

    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setStatus("TODO");
    setAssignee("");
    setDueDate("");

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      {/* Dialog */}
      <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-[560px] sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">
              Create task
            </h2>

            <p className="mt-0.5 text-xs text-zinc-500">
              Add a new task to this project.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label
                htmlFor="task-title"
                className="mb-2 block text-xs font-semibold text-zinc-700"
              >
                Task title
              </label>

              <input
                id="task-title"
                autoFocus
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="What needs to be done?"
                className={`h-11 w-full rounded-lg border px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:ring-2 ${
                  error
                    ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                    : "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-100"
                }`}
              />

              {error && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {error}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="task-description"
                className="mb-2 block text-xs font-semibold text-zinc-700"
              >
                Description
              </label>

              <textarea
                id="task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add more details..."
                className="min-h-[100px] w-full resize-none rounded-lg border border-zinc-200 p-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              />
            </div>

            {/* Properties */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Status */}
              <div>
                <label
                  htmlFor="task-status"
                  className="mb-2 block text-xs font-semibold text-zinc-700"
                >
                  Status
                </label>

                <div className="relative">
                  <select
                    id="task-status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3 pr-9 text-sm outline-none focus:border-zinc-400"
                  >
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="DONE">Done</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="task-priority"
                  className="mb-2 block text-xs font-semibold text-zinc-700"
                >
                  Priority
                </label>

                <div className="relative">
                  <Flag
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-zinc-200 bg-white pl-9 pr-9 text-sm outline-none focus:border-zinc-400"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label
                  htmlFor="task-assignee"
                  className="mb-2 block text-xs font-semibold text-zinc-700"
                >
                  Assignee
                </label>

                <div className="relative">
                  <User
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <select
                    id="task-assignee"
                    value={assignee}
                    onChange={(event) => setAssignee(event.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-zinc-200 bg-white pl-9 pr-9 text-sm outline-none focus:border-zinc-400"
                  >
                    <option value="">Unassigned</option>
                    <option value="alex">Alex</option>
                    <option value="sarah">Sarah</option>
                    <option value="mike">Mike</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                </div>
              </div>

              {/* Due date */}
              <div>
                <label
                  htmlFor="task-date"
                  className="mb-2 block text-xs font-semibold text-zinc-700"
                >
                  Due date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="task-date"
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 bg-zinc-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreateTask}
            className="h-10 rounded-lg bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Create task
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function GeneralSettings() {
  const { showToast } = useToast();

  const [workspaceName, setWorkspaceName] = useState("Product Development");
  const [workspaceUrl, setWorkspaceUrl] = useState("product-development");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const [compactTasks, setCompactTasks] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    if (!workspaceName.trim()) {
      showToast(
        "error",
        "Workspace name required",
        "Please enter a workspace name before saving.",
      );
      return;
    }

    setSaving(true);

    window.setTimeout(() => {
      setSaving(false);

      showToast(
        "success",
        "Settings saved",
        "Your workspace settings have been updated.",
      );
    }, 700);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-zinc-950">General</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Manage your workspace name and basic preferences.
        </p>
      </div>

      {/* Workspace details */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">
            Workspace details
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            These details are visible to everyone in your workspace.
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Workspace name */}
          <div>
            <label
              htmlFor="workspace-name"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Workspace name
            </label>

            <input
              id="workspace-name"
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 sm:max-w-lg"
            />
          </div>

          {/* Workspace URL */}
          <div>
            <label
              htmlFor="workspace-url"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Workspace URL
            </label>

            <div className="flex w-full sm:max-w-lg">
              <span className="flex h-10 shrink-0 items-center rounded-l-lg border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-xs text-zinc-400">
                teamflow.com/
              </span>

              <input
                id="workspace-url"
                value={workspaceUrl}
                onChange={(event) => setWorkspaceUrl(event.target.value)}
                className="h-10 min-w-0 flex-1 rounded-r-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
              />
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label
              htmlFor="timezone"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Timezone
            </label>

            <select
              id="timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-400 sm:max-w-lg"
            >
              <option value="Asia/Kolkata">India Standard Time (IST)</option>
              <option value="UTC">Coordinated Universal Time (UTC)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London Time (GMT)</option>
            </select>
          </div>
        </div>

        {/* Save */}
        <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-zinc-400">
            Changes are currently local to this page.
          </p>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex h-9 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={14} />
                Save changes
              </>
            )}
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">Preferences</h3>

          <p className="mt-1 text-xs text-zinc-500">
            Customize how your workspace behaves.
          </p>
        </div>

        <div className="divide-y divide-zinc-100">
          {/* Compact tasks */}
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm font-medium text-zinc-800">
                Compact task cards
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Show more tasks with less vertical spacing.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCompactTasks((current) => !current)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                compactTasks ? "bg-zinc-900" : "bg-zinc-200"
              }`}
              aria-label="Toggle compact task cards"
              aria-pressed={compactTasks}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                  compactTasks ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Completed tasks */}
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm font-medium text-zinc-800">
                Show completed tasks
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Keep completed tasks visible in project views.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCompleted((current) => !current)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                showCompleted ? "bg-zinc-900" : "bg-zinc-200"
              }`}
              aria-label="Toggle completed tasks"
              aria-pressed={showCompleted}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                  showCompleted ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

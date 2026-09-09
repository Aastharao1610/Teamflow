"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WorkspaceSettings() {
  const { showToast } = useToast();

  const [name, setName] = useState("Product Development");
  const [description, setDescription] = useState(
    "Plan, manage, and collaborate on everything your team is building.",
  );
  const [defaultView, setDefaultView] = useState("Board");
  const [defaultStatus, setDefaultStatus] = useState("Todo");
  const [saving, setSaving] = useState(false);

  function handleSave() {
    if (!name.trim()) {
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
        "Workspace settings saved",
        "Your workspace settings have been updated.",
      );
    }, 700);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-zinc-950">Workspace</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Configure how your workspace looks and behaves.
        </p>
      </div>

      {/* Workspace identity */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">
            Workspace identity
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Update the basic information for your workspace.
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Logo */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-800">
              Workspace logo
            </label>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-950 text-lg font-semibold text-white">
                T
              </div>

              <button
                type="button"
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Change logo
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="settings-workspace-name"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Workspace name
            </label>

            <input
              id="settings-workspace-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 sm:max-w-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="workspace-description"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Description
            </label>

            <textarea
              id="workspace-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm leading-6 text-zinc-900 outline-none transition focus:border-zinc-400 sm:max-w-lg"
            />
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

      {/* Defaults */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">
            Workspace defaults
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Choose the defaults used when creating or opening projects.
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Default view */}
          <div>
            <label
              htmlFor="default-view"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Default project view
            </label>

            <select
              id="default-view"
              value={defaultView}
              onChange={(event) => setDefaultView(event.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-400 sm:max-w-lg"
            >
              <option value="Board">Board</option>
              <option value="List">List</option>
            </select>
          </div>

          {/* Default status */}
          <div>
            <label
              htmlFor="default-status"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Default task status
            </label>

            <select
              id="default-status"
              value={defaultStatus}
              onChange={(event) => setDefaultStatus(event.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-400 sm:max-w-lg"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}

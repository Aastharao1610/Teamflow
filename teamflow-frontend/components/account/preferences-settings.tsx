"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PreferencesSettings() {
  const { showToast } = useToast();

  const [theme, setTheme] = useState("System");
  const [language, setLanguage] = useState("English");
  const [startPage, setStartPage] = useState("Dashboard");
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);

    window.setTimeout(() => {
      setSaving(false);

      showToast(
        "success",
        "Preferences saved",
        "Your personal preferences have been updated.",
      );
    }, 700);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-zinc-950">Preferences</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Customize your personal Teamflow experience.
        </p>
      </div>

      {/* Appearance */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">Appearance</h3>

          <p className="mt-1 text-xs text-zinc-500">
            Choose how Teamflow should look on your devices.
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <label
              htmlFor="account-theme"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Theme
            </label>

            <select
              id="account-theme"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-400 sm:max-w-lg"
            >
              <option value="System">System</option>
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="account-language"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Language
            </label>

            <select
              id="account-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-400 sm:max-w-lg"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">Navigation</h3>

          <p className="mt-1 text-xs text-zinc-500">
            Choose what you see when you open Teamflow.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <label
            htmlFor="start-page"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Start page
          </label>

          <select
            id="start-page"
            value={startPage}
            onChange={(event) => setStartPage(event.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-400 sm:max-w-lg"
          >
            <option value="Dashboard">Dashboard</option>
            <option value="My Tasks">My Tasks</option>
            <option value="Projects">Projects</option>
          </select>
        </div>
      </section>

      {/* Behavior */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">Behavior</h3>

          <p className="mt-1 text-xs text-zinc-500">
            Configure shortcuts and personal notifications.
          </p>
        </div>

        <div className="divide-y divide-zinc-100">
          <PreferenceRow
            title="Keyboard shortcuts"
            description="Use keyboard shortcuts to navigate Teamflow faster."
            checked={keyboardShortcuts}
            onChange={() => setKeyboardShortcuts((current) => !current)}
          />

          <PreferenceRow
            title="Task notifications"
            description="Notify me about updates to tasks I'm assigned to."
            checked={taskNotifications}
            onChange={() => setTaskNotifications((current) => !current)}
          />
        </div>

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
                Save preferences
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-800">{title}</p>

        <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        aria-label={title}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-zinc-900" : "bg-zinc-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

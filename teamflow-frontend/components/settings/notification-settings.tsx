"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NotificationSettings() {
  const { showToast } = useToast();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskAssignments, setTaskAssignments] = useState(true);
  const [taskComments, setTaskComments] = useState(true);
  const [dueDateReminders, setDueDateReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  const [mentions, setMentions] = useState(true);
  const [projectActivity, setProjectActivity] = useState(true);

  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);

    window.setTimeout(() => {
      setSaving(false);

      showToast(
        "success",
        "Notification settings saved",
        "Your notification preferences have been updated.",
      );
    }, 700);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-zinc-950">Notifications</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Choose when Teamflow should notify you.
        </p>
      </div>

      {/* Email notifications */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">
            Email notifications
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Control which updates you receive by email.
          </p>
        </div>

        <div className="divide-y divide-zinc-100">
          <NotificationRow
            title="Email notifications"
            description="Receive important workspace updates by email."
            checked={emailNotifications}
            onChange={() => setEmailNotifications((current) => !current)}
          />

          <NotificationRow
            title="Task assignments"
            description="Get notified when a task is assigned to you."
            checked={taskAssignments}
            onChange={() => setTaskAssignments((current) => !current)}
          />

          <NotificationRow
            title="Task comments"
            description="Get notified when someone comments on your tasks."
            checked={taskComments}
            onChange={() => setTaskComments((current) => !current)}
          />

          <NotificationRow
            title="Due date reminders"
            description="Receive reminders when tasks are approaching their due date."
            checked={dueDateReminders}
            onChange={() => setDueDateReminders((current) => !current)}
          />

          <NotificationRow
            title="Weekly summary"
            description="Receive a weekly overview of workspace activity."
            checked={weeklySummary}
            onChange={() => setWeeklySummary((current) => !current)}
          />
        </div>
      </section>

      {/* In-app notifications */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">
            In-app notifications
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Choose which events appear in your Teamflow notifications.
          </p>
        </div>

        <div className="divide-y divide-zinc-100">
          <NotificationRow
            title="Mentions"
            description="Notify me when someone mentions me in a comment."
            checked={mentions}
            onChange={() => setMentions((current) => !current)}
          />

          <NotificationRow
            title="Project activity"
            description="Show important updates from projects you follow."
            checked={projectActivity}
            onChange={() => setProjectActivity((current) => !current)}
          />
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
    </div>
  );
}

function NotificationRow({
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

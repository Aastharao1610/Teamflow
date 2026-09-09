"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Inbox,
  MessageCircle,
  AtSign,
  ClipboardCheck,
  UserPlus,
  Loader2,
} from "lucide-react";
import AppShell from "@/components/layout/app-shell";
import {
  NotificationItem,
  type Notification,
} from "@/components/notifications/notification-item";
import { useToast } from "@/hooks/use-toast";

type Filter = "all" | "unread" | "mentions" | "activity";

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "task",
    title: "You were assigned a task",
    description:
      "Sarah assigned you “Implement authentication” in Teamflow Backend.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "comment",
    title: "New comment on your task",
    description:
      "Alex commented on “Create Task API”: “Validation looks good. Let's review the edge cases.”",
    time: "32 minutes ago",
    read: false,
  },
  {
    id: "3",
    type: "mention",
    title: "You were mentioned",
    description: "Mike mentioned you in a comment on the Project module.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    type: "completed",
    title: "Task completed",
    description:
      "Sarah completed “Auth module” in the Teamflow Backend project.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "member",
    title: "New member joined",
    description: "Rachel Smith joined the Design team in your workspace.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    type: "task",
    title: "Task due tomorrow",
    description:
      "“Workspace testing” is due tomorrow. You are assigned to this task.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "7",
    type: "comment",
    title: "New comment on your task",
    description: "Sarah commented on “Implement authentication”.",
    time: "2 days ago",
    read: true,
  },
];

const filters: {
  id: Filter;
  label: string;
}[] = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "unread",
    label: "Unread",
  },
  {
    id: "mentions",
    label: "Mentions",
  },
  {
    id: "activity",
    label: "Activity",
  },
];

export default function NotificationsPage() {
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (activeFilter === "unread") {
        return !notification.read;
      }

      if (activeFilter === "mentions") {
        return notification.type === "mention";
      }

      if (activeFilter === "activity") {
        return (
          notification.type === "task" ||
          notification.type === "comment" ||
          notification.type === "completed"
        );
      }

      return true;
    });
  }, [notifications, activeFilter]);

  function markAsRead(id: string) {
    const notification = notifications.find((item) => item.id === id);

    if (!notification || notification.read) {
      return;
    }

    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );

    showToast(
      "success",
      "Notification marked as read",
      "The notification has been marked as read.",
    );
  }

  function markAllAsRead() {
    if (unreadCount === 0 || markingAll) {
      return;
    }

    setMarkingAll(true);

    window.setTimeout(() => {
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        })),
      );

      setMarkingAll(false);

      showToast(
        "success",
        "All notifications marked as read",
        "You're all caught up.",
      );
    }, 500);
  }

  const isCompletelyEmpty = notifications.length === 0;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1000px] p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              Stay up to date with activity across your workspace.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={markingAll}
              className="flex h-9 items-center gap-2 self-start rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
            >
              {markingAll ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCheck size={14} />
              )}

              {markingAll ? "Marking..." : "Mark all as read"}
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex min-w-max gap-1 rounded-lg border border-zinc-200 bg-white p-1">
            {filters.map((filter) => {
              const active = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-zinc-100 text-zinc-950"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification list */}
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                />
              ))}
            </div>
          ) : (
            <div className="relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
              {/* Decorative background */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-50 blur-3xl" />

              {/* Icon */}
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm">
                  {isCompletelyEmpty ? (
                    <Bell
                      size={28}
                      strokeWidth={1.6}
                      className="text-zinc-400"
                    />
                  ) : (
                    <Inbox
                      size={28}
                      strokeWidth={1.6}
                      className="text-zinc-400"
                    />
                  )}
                </div>

                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-zinc-950 text-white">
                  <Check size={12} strokeWidth={2.5} />
                </div>
              </div>

              {/* Text */}
              <h2 className="relative mt-6 text-base font-semibold text-zinc-950">
                {isCompletelyEmpty
                  ? "You're all caught up"
                  : `No ${activeFilter} notifications`}
              </h2>

              <p className="relative mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                {isCompletelyEmpty
                  ? "When something important happens in your workspace, you'll see it here."
                  : "There aren't any notifications matching this filter right now. Try another filter to see more activity."}
              </p>

              {/* Helpful visual */}
              {isCompletelyEmpty && (
                <div className="relative mt-7 flex items-center gap-2 text-xs text-zinc-400">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100">
                    <MessageCircle size={13} />
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100">
                    <AtSign size={13} />
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100">
                    <ClipboardCheck size={13} />
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100">
                    <UserPlus size={13} />
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

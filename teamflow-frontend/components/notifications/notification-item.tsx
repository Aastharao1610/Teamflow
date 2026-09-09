"use client";

import {
  CheckCircle2,
  MessageCircle,
  UserPlus,
  ClipboardCheck,
  AtSign,
} from "lucide-react";

export type Notification = {
  id: string;
  type: "task" | "comment" | "mention" | "member" | "completed";
  title: string;
  description: string;
  time: string;
  read: boolean;
};

type NotificationItemProps = {
  notification: Notification;
  onRead: (id: string) => void;
};

const notificationIcons = {
  task: ClipboardCheck,
  comment: MessageCircle,
  mention: AtSign,
  member: UserPlus,
  completed: CheckCircle2,
};

export function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const Icon = notificationIcons[notification.type];

  return (
    <div
      className={`group relative flex gap-3 px-4 py-4 transition sm:px-5 ${
        notification.read ? "bg-white" : "bg-zinc-50/70"
      } hover:bg-zinc-50`}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <span className="absolute left-1.5 top-6 h-1.5 w-1.5 rounded-full bg-zinc-900 sm:left-2" />
      )}

      {/* Icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          notification.read
            ? "bg-zinc-100 text-zinc-500"
            : "bg-zinc-900 text-white"
        }`}
      >
        <Icon size={16} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pr-2">
        <p
          className={`text-sm leading-5 ${
            notification.read
              ? "font-medium text-zinc-700"
              : "font-semibold text-zinc-900"
          }`}
        >
          {notification.title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {notification.description}
        </p>

        <p className="mt-2 text-[11px] text-zinc-400">{notification.time}</p>
      </div>

      {/* Mark as read */}
      {!notification.read && (
        <button
          type="button"
          onClick={() => onRead(notification.id)}
          className="shrink-0 self-start rounded-md px-2 py-1 text-[11px] font-medium text-zinc-500 opacity-0 transition hover:bg-white hover:text-zinc-900 group-hover:opacity-100"
        >
          Mark read
        </button>
      )}
    </div>
  );
}

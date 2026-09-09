"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CheckSquare,
  ChevronDown,
  FolderKanban,
  Home,
  Plus,
  Settings,
  Users,
  Workflow,
  X,
} from "lucide-react";

const mainNavigation = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "My Tasks",
    href: "/dashboard?view=tasks",
    icon: CheckSquare,
  },
];

const workspaceNavigation = [
  {
    label: "Projects",
    href: "/dashboard?view=projects",
    icon: FolderKanban,
  },
  {
    label: "Members",
    href: "/members",
    icon: Users,
  },
];

type AppSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export default function AppSidebar({
  mobileOpen = false,
  onClose,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col
          border-r border-zinc-200 bg-white
          transition-transform duration-200
          lg:static lg:z-auto lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-[68px] items-center justify-between border-b border-zinc-100 px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Workflow size={17} strokeWidth={2.5} />
            </div>

            <span className="text-[17px] font-semibold tracking-tight text-zinc-950">
              Teamflow
            </span>
          </Link>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workspace */}
        <div className="px-3 pt-4">
          <button className="flex w-full items-center justify-between rounded-lg px-2.5 py-2.5 transition hover:bg-zinc-50">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-xs font-semibold text-white">
                T
              </div>

              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-medium text-zinc-900">
                  My Workspace
                </p>

                <p className="text-[11px] text-zinc-500">Workspace</p>
              </div>
            </div>

            <ChevronDown size={15} className="text-zinc-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pt-6">
          <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            General
          </p>

          <div className="space-y-0.5">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition ${
                    active
                      ? "bg-zinc-100 font-medium text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between px-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                Workspace
              </p>

              <button className="text-zinc-400 hover:text-zinc-900">
                <Plus size={15} />
              </button>
            </div>

            <div className="space-y-0.5">
              {workspaceNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
                  >
                    <Icon size={17} strokeWidth={1.8} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-zinc-100 p-3">
          <Link
            href="/notifications"
            onClick={onClose}
            className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
          >
            <Bell size={17} />
            Notifications
          </Link>

          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
          >
            <Settings size={17} />
            Settings
          </Link>

          <div className="mt-2 flex items-center gap-3 rounded-md px-2.5 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-900">
                Account
              </p>

              <p className="truncate text-[11px] text-zinc-500">
                Manage account
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

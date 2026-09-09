"use client";

import { Bell, Building2, Settings, Shield, Users } from "lucide-react";

export type SettingsSection =
  | "general"
  | "workspace"
  | "members"
  | "notifications"
  | "security";

const settingsNavigation: {
  id: SettingsSection;
  label: string;
  icon: typeof Settings;
}[] = [
  {
    id: "general",
    label: "General",
    icon: Settings,
  },
  {
    id: "workspace",
    label: "Workspace",
    icon: Building2,
  },
  {
    id: "members",
    label: "Members",
    icon: Users,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
  },
];

type SettingsSidebarProps = {
  activeSection: SettingsSection;
  onChange: (section: SettingsSection) => void;
};

export function SettingsSidebar({
  activeSection,
  onChange,
}: SettingsSidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:w-56">
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
        Settings
      </p>

      <nav className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
        {settingsNavigation.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition lg:w-full ${
                active
                  ? "bg-zinc-100 font-medium text-zinc-950"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon size={16} strokeWidth={1.8} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

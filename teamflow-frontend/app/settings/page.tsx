"use client";

import { useState } from "react";
import AppShell from "@/components/layout/app-shell";
import {
  SettingsSidebar,
  type SettingsSection,
} from "@/components/settings/settings-sidebar";
import { GeneralSettings } from "@/components/settings/general-settings";
import { WorkspaceSettings } from "@/components/settings/workspace-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { SecuritySettings } from "@/components/settings/security-settings";

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");

  function renderSettings() {
    switch (activeSection) {
      case "workspace":
        return <WorkspaceSettings />;

      case "notifications":
        return <NotificationSettings />;

      case "security":
        return <SecuritySettings />;

      case "members":
        return (
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="text-base font-semibold text-zinc-950">Members</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Member settings will be available here.
            </p>
          </div>
        );

      case "general":
      default:
        return <GeneralSettings />;
    }
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8">
        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Settings
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Manage your workspace settings and preferences.
          </p>
        </div>

        {/* Settings layout */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <SettingsSidebar
            activeSection={activeSection}
            onChange={setActiveSection}
          />

          <main className="min-w-0 flex-1">{renderSettings()}</main>
        </div>
      </div>
    </AppShell>
  );
}

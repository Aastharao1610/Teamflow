"use client";

import { useState } from "react";
import AppShell from "@/components/layout/app-shell";
import { ProfileSettings } from "@/components/account/profile-settings";
import { PasswordSettings } from "@/components/account/password-settings";
import { PreferencesSettings } from "@/components/account/preferences-settings";

type AccountSection = "profile" | "password" | "preferences";

const navigation: {
  id: AccountSection;
  label: string;
}[] = [
  {
    id: "profile",
    label: "Profile",
  },
  {
    id: "password",
    label: "Password",
  },
  {
    id: "preferences",
    label: "Preferences",
  },
];

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState<AccountSection>("profile");

  function renderContent() {
    switch (activeSection) {
      case "password":
        return <PasswordSettings />;

      case "preferences":
        return <PreferencesSettings />;

      case "profile":
      default:
        return <ProfileSettings />;
    }
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Account
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Manage your personal account and preferences.
          </p>
        </div>

        {/* Layout */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          {/* Navigation */}
          <aside className="w-full shrink-0 lg:w-48">
            <nav className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
              {navigation.map((item) => {
                const active = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`shrink-0 rounded-lg px-3 py-2 text-sm transition lg:block lg:w-full lg:text-left ${
                      active
                        ? "bg-zinc-100 font-medium text-zinc-950"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main className="min-w-0 flex-1">{renderContent()}</main>
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import AppSidebar from "./app-sidebar";
import Topbar from "./topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <AppSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex h-14 shrink-0 items-center border-b border-zinc-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="ml-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-white">
              <span className="text-xs font-semibold">T</span>
            </div>

            <span className="text-sm font-semibold">Teamflow</span>
          </div>
        </div>

        <div className="hidden lg:block">
          <Topbar />
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

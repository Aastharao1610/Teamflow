"use client";

import { ChevronDown, MoreHorizontal, Plus, Users } from "lucide-react";

export function WorkspaceHeader() {
  return (
    <div className="mb-6 flex flex-col gap-5 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
          <span>Workspace</span>

          <ChevronDown size={14} />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          Product Development
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
          Plan, manage, and collaborate on everything your team is building.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50">
          <Users size={15} />
          Members
        </button>

        <button className="flex items-center gap-2 rounded-lg bg-zinc-950 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
          <Plus size={15} />
          New project
        </button>

        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm hover:bg-zinc-50">
          <MoreHorizontal size={17} />
        </button>
      </div>
    </div>
  );
}

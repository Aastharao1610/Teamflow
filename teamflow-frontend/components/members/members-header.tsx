"use client";

import { useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { InviteMemberDialog } from "./invite-member-dialog";

export function MembersHeader() {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex flex-col gap-5 sm:mb-8">
        {/* Heading */}
        <div>
          <p className="text-sm text-zinc-500">Workspace</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Members
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
            Manage your workspace members, roles, and team access.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Search + Filter */}
          <div className="flex min-w-0 flex-1 gap-2 sm:max-w-xl">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                strokeWidth={1.8}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                type="text"
                placeholder="Search members..."
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </div>

            <button
              className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-600 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900"
              aria-label="Filter members"
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          {/* Invite */}
          <button
            onClick={() => setInviteOpen(true)}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <Plus size={16} />
            Invite member
          </button>
        </div>
      </div>

      <InviteMemberDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </>
  );
}

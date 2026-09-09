"use client";

import { useState } from "react";
import { MoreHorizontal, UserRound, Shield, Trash2 } from "lucide-react";

export type Member = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: "Admin" | "Member" | "Viewer";
  team: string;
  tasks: number;
  status: "Active" | "Pending";
};

type MemberRowProps = {
  member: Member;
};

const roleStyles = {
  Admin: "bg-zinc-900 text-white",
  Member: "bg-zinc-100 text-zinc-700",
  Viewer: "bg-zinc-50 text-zinc-500 border border-zinc-200",
};

export function MemberRow({ member }: MemberRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative grid grid-cols-1 gap-4 px-4 py-4 transition hover:bg-zinc-50 sm:grid-cols-[minmax(220px,1.5fr)_120px_140px_80px_100px_40px] sm:items-center sm:px-5">
      {/* Member */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700">
          {member.initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-900">
            {member.name}
          </p>

          <p className="truncate text-xs text-zinc-500">{member.email}</p>
        </div>
      </div>

      {/* Role */}
      <div className="flex items-center gap-2 sm:block">
        <span className="text-xs text-zinc-400 sm:hidden">Role:</span>

        <span
          className={`inline-flex rounded-md px-2 py-1 text-[11px] font-medium ${roleStyles[member.role]}`}
        >
          {member.role}
        </span>
      </div>

      {/* Team */}
      <div className="flex items-center gap-2 sm:block">
        <span className="text-xs text-zinc-400 sm:hidden">Team:</span>

        <span className="text-sm text-zinc-600">{member.team}</span>
      </div>

      {/* Tasks */}
      <div className="flex items-center gap-2 sm:block">
        <span className="text-xs text-zinc-400 sm:hidden">Tasks:</span>

        <span className="text-sm font-medium text-zinc-800">
          {member.tasks}
        </span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 sm:block">
        <span className="text-xs text-zinc-400 sm:hidden">Status:</span>

        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              member.status === "Active" ? "bg-emerald-500" : "bg-amber-400"
            }`}
          />

          <span className="text-sm text-zinc-600">{member.status}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute right-4 top-4 sm:static sm:flex sm:justify-end">
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
            menuOpen
              ? "bg-zinc-100 text-zinc-900"
              : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
          aria-label={`Actions for ${member.name}`}
          aria-expanded={menuOpen}
        >
          <MoreHorizontal size={17} />
        </button>

        {menuOpen && (
          <>
            {/* Outside click area */}
            <button
              aria-label="Close actions menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-10 cursor-default"
            />

            {/* Menu */}
            <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
              <button
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
              >
                <UserRound size={15} />
                View profile
              </button>

              <button
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
              >
                <Shield size={15} />
                Change role
              </button>

              <div className="my-1 border-t border-zinc-100" />

              <button
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={15} />
                Remove member
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

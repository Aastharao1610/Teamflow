"use client";

import { UserPlus, Users } from "lucide-react";
import { MemberRow, type Member } from "./member-row";

const members: Member[] = [
  {
    id: "1",
    name: "Astha",
    email: "astha@teamflow.com",
    initials: "A",
    role: "Admin",
    team: "Engineering",
    tasks: 18,
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@teamflow.com",
    initials: "SW",
    role: "Admin",
    team: "Engineering",
    tasks: 14,
    status: "Active",
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex@teamflow.com",
    initials: "AJ",
    role: "Member",
    team: "Engineering",
    tasks: 21,
    status: "Active",
  },
  {
    id: "4",
    name: "Mike Chen",
    email: "mike@teamflow.com",
    initials: "MC",
    role: "Member",
    team: "Engineering",
    tasks: 12,
    status: "Active",
  },
  {
    id: "5",
    name: "Rachel Smith",
    email: "rachel@teamflow.com",
    initials: "RS",
    role: "Member",
    team: "Design",
    tasks: 9,
    status: "Active",
  },
  {
    id: "6",
    name: "James Brown",
    email: "james@teamflow.com",
    initials: "JB",
    role: "Member",
    team: "Marketing",
    tasks: 7,
    status: "Active",
  },
  {
    id: "7",
    name: "Priya Shah",
    email: "priya@teamflow.com",
    initials: "PS",
    role: "Viewer",
    team: "Marketing",
    tasks: 3,
    status: "Active",
  },
  {
    id: "8",
    name: "David Lee",
    email: "david@teamflow.com",
    initials: "DL",
    role: "Member",
    team: "Design",
    tasks: 11,
    status: "Pending",
  },
];

export function MembersList() {
  const hasMembers = members.length > 0;

  return (
    <section>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        {hasMembers ? (
          <>
            {/* Desktop header */}
            <div className="hidden border-b border-zinc-200 bg-zinc-50/70 px-5 py-3 sm:grid sm:grid-cols-[minmax(220px,1.5fr)_120px_140px_80px_100px_40px] sm:items-center">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Member
              </span>

              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Role
              </span>

              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Team
              </span>

              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Tasks
              </span>

              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Status
              </span>

              <span />
            </div>

            {/* Members */}
            <div className="divide-y divide-zinc-100">
              {members.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
              <Users size={26} strokeWidth={1.7} />
            </div>

            <h3 className="mt-5 text-base font-semibold text-zinc-950">
              No members yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Your workspace doesn&apos;t have any team members yet. Invite
              people to start collaborating on projects and tasks.
            </p>

            <button
              type="button"
              className="mt-6 flex h-10 items-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <UserPlus size={16} />
              Invite member
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      {hasMembers && (
        <div className="mt-3 flex flex-col gap-2 px-1 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Showing {members.length} of 14 members</span>

          <span>Last updated just now</span>
        </div>
      )}
    </section>
  );
}

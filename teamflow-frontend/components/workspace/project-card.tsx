"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, MoreHorizontal } from "lucide-react";

type ProjectCardProps = {
  id: string;
  name: string;
  description: string;
  color: string;
  tasks: number;
  completed: number;
  members: string[];
  dueDate: string;
};

export function ProjectCard({
  id,
  name,
  description,
  color,
  tasks,
  completed,
  members,
  dueDate,
}: ProjectCardProps) {
  const progress = tasks === 0 ? 0 : Math.round((completed / tasks) * 100);

  return (
    <Link
      href={`/project/${id}`}
      className="group block rounded-xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
          >
            <span className="text-sm font-semibold text-white">
              {name.charAt(0)}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-950">{name}</h3>

            <p className="mt-0.5 text-xs text-zinc-400">{tasks} tasks</p>
          </div>
        </div>

        <button
          onClick={(event) => event.preventDefault()}
          className="rounded-md p-1 text-zinc-300 opacity-0 transition hover:bg-zinc-100 hover:text-zinc-700 group-hover:opacity-100"
        >
          <MoreHorizontal size={17} />
        </button>
      </div>

      {/* Description */}
      <p className="mt-5 line-clamp-2 min-h-10 text-xs leading-5 text-zinc-500">
        {description}
      </p>

      {/* Progress */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-medium text-zinc-500">
            Progress
          </span>

          <span className="text-[10px] font-semibold text-zinc-700">
            {progress}%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-zinc-900 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex -space-x-2">
          {members.map((member) => (
            <div
              key={member}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-zinc-200 text-[9px] font-semibold text-zinc-700"
            >
              {member}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
          <CalendarDays size={12} />
          {dueDate}
        </div>
      </div>

      {/* Hover arrow */}
      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-zinc-400 transition group-hover:text-zinc-900">
        Open project
        <ArrowUpRight size={13} />
      </div>
    </Link>
  );
}

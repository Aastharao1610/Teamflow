"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, Users } from "lucide-react";
import { CreateTaskDialog } from "./create-task-dialog";

export function BoardHeader() {
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  return (
    <>
      <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs text-zinc-500">Product Development</p>

            <h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
              Teamflow Backend
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50">
              <Users size={15} />
              Members
            </button>

            <button
              onClick={() => setCreateTaskOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-zinc-950 px-3.5 py-2 text-xs font-medium text-white hover:bg-zinc-800"
            >
              <Plus size={15} />
              New Task
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50">
              <MoreHorizontal size={17} />
            </button>
          </div>
        </div>
      </div>

      <CreateTaskDialog
        open={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
      />
    </>
  );
}

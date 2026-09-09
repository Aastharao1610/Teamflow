export default function Loading() {
  return (
    <div className="flex h-full min-h-full flex-col bg-zinc-50">
      {/* Header */}
      <div className="shrink-0 border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-6 w-40 animate-pulse rounded bg-zinc-200" />
            <div className="mt-2 h-3 w-56 animate-pulse rounded bg-zinc-100" />
          </div>

          <div className="flex gap-2">
            <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100" />
            <div className="h-9 w-28 animate-pulse rounded-lg bg-zinc-200" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex gap-2">
          <div className="h-8 w-20 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-8 w-20 animate-pulse rounded-lg bg-zinc-100" />
        </div>

        <div className="flex gap-2">
          <div className="h-8 w-20 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-8 w-20 animate-pulse rounded-lg bg-zinc-100" />
        </div>
      </div>

      {/* Kanban board */}
      <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
        <div className="flex h-full min-w-max gap-4">
          {[1, 2, 3, 4].map((column) => (
            <div
              key={column}
              className="w-[280px] shrink-0 rounded-xl border border-zinc-200 bg-zinc-100/60 p-3 sm:w-[300px]"
            >
              {/* Column header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
                <div className="h-5 w-6 animate-pulse rounded bg-zinc-200" />
              </div>

              {/* Task cards */}
              <div className="space-y-3">
                {[1, 2, 3].map((task) => (
                  <div
                    key={task}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />

                    <div className="mt-3 h-3 w-full animate-pulse rounded bg-zinc-100" />
                    <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-zinc-100" />

                    <div className="mt-5 flex items-center justify-between">
                      <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-100" />
                      <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

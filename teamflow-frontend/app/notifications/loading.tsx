export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1000px] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-40 animate-pulse rounded-lg bg-zinc-200" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-zinc-100" />
        </div>

        <div className="h-9 w-28 animate-pulse rounded-lg bg-zinc-100" />
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2 overflow-hidden">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-9 w-20 shrink-0 animate-pulse rounded-lg bg-zinc-100"
          />
        ))}
      </div>

      {/* Notifications */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="divide-y divide-zinc-100">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div key={item} className="flex gap-3 p-4 sm:p-5">
              {/* Icon */}
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-zinc-100" />

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="h-4 w-3/4 max-w-md animate-pulse rounded bg-zinc-200" />
                <div className="mt-2 h-3 w-full max-w-lg animate-pulse rounded bg-zinc-100" />

                <div className="mt-3 flex items-center gap-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
                  <div className="h-3 w-16 animate-pulse rounded bg-zinc-100" />
                </div>
              </div>

              {/* Read indicator */}
              <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

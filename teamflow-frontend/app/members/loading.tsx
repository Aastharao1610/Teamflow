export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-32 animate-pulse rounded-lg bg-zinc-200" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-zinc-100" />
        </div>

        <div className="h-10 w-32 animate-pulse rounded-lg bg-zinc-200" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-zinc-200 bg-white p-5"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
            <div className="mt-4 h-8 w-14 animate-pulse rounded-lg bg-zinc-200" />
            <div className="mt-3 h-3 w-20 animate-pulse rounded bg-zinc-100" />
          </div>
        ))}
      </div>

      {/* Members section */}
      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-9 w-full max-w-xs animate-pulse rounded-lg bg-zinc-100" />

          <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100" />
        </div>

        {/* Member rows */}
        <div className="divide-y divide-zinc-100">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div key={item} className="p-4 sm:px-5">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-zinc-200" />

                {/* Name + email */}
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
                  <div className="mt-2 h-3 w-44 animate-pulse rounded bg-zinc-100" />
                </div>

                {/* Role */}
                <div className="hidden w-20 animate-pulse rounded-full bg-zinc-100 sm:block">
                  <div className="h-6" />
                </div>

                {/* Team */}
                <div className="hidden h-3 w-20 animate-pulse rounded bg-zinc-100 md:block" />

                {/* Tasks */}
                <div className="hidden h-3 w-12 animate-pulse rounded bg-zinc-100 lg:block" />

                {/* Menu */}
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

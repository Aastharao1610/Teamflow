export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8">
      {/* Page heading */}
      <div className="mb-8">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-zinc-100" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        {/* Settings navigation */}
        <aside className="w-full shrink-0 lg:w-48">
          <div className="flex gap-2 overflow-hidden lg:block lg:space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-9 w-24 shrink-0 animate-pulse rounded-lg bg-zinc-100 lg:w-full"
              />
            ))}
          </div>
        </aside>

        {/* Settings content */}
        <main className="min-w-0 flex-1">
          <div className="rounded-xl border border-zinc-200 bg-white">
            {/* Section heading */}
            <div className="border-b border-zinc-200 p-5 sm:p-6">
              <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
              <div className="mt-2 h-4 w-72 animate-pulse rounded bg-zinc-100" />
            </div>

            {/* Form fields */}
            <div className="space-y-6 p-5 sm:p-6">
              {[1, 2, 3].map((item) => (
                <div key={item}>
                  <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
                  <div className="mt-2 h-10 w-full animate-pulse rounded-lg bg-zinc-100" />
                  <div className="mt-2 h-3 w-48 animate-pulse rounded bg-zinc-100" />
                </div>
              ))}

              {/* Preferences */}
              <div className="border-t border-zinc-100 pt-6">
                <div className="h-5 w-28 animate-pulse rounded bg-zinc-200" />

                <div className="mt-5 space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="h-4 w-36 animate-pulse rounded bg-zinc-200" />
                        <div className="mt-2 h-3 w-56 animate-pulse rounded bg-zinc-100" />
                      </div>

                      <div className="h-6 w-11 shrink-0 animate-pulse rounded-full bg-zinc-200" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end border-t border-zinc-100 pt-6">
                <div className="h-10 w-24 animate-pulse rounded-lg bg-zinc-200" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

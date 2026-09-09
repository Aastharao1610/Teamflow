export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        {/* Workspace header */}
        <section>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-200" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-zinc-100" />
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
              <div className="mt-4 h-8 w-16 animate-pulse rounded-lg bg-zinc-200" />
              <div className="mt-3 h-3 w-28 animate-pulse rounded bg-zinc-100" />
            </div>
          ))}
        </section>

        {/* Projects */}
        <section>
          <div className="mb-4 h-6 w-28 animate-pulse rounded bg-zinc-200" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-zinc-200 bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-200" />

                  <div className="flex-1">
                    <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
                    <div className="mt-2 h-3 w-20 animate-pulse rounded bg-zinc-100" />
                  </div>
                </div>

                <div className="mt-5 h-3 w-full animate-pulse rounded bg-zinc-100" />
                <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-zinc-100" />

                <div className="mt-6 flex items-center justify-between">
                  <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

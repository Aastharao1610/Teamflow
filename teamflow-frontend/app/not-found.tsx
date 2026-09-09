import Link from "next/link";
import { ArrowLeft, Home, Workflow } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white">
          <Workflow size={22} />
        </div>

        <p className="mt-8 text-sm font-semibold text-zinc-400">404</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Page not found
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href="/dashboard"
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <Home size={15} />
            Go to dashboard
          </Link>

          <Link
            href="/dashboard"
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <ArrowLeft size={15} />
            Go back
          </Link>
        </div>
      </div>
    </main>
  );
}

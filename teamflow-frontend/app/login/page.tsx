"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Workflow } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left side */}
        <div className="hidden flex-col justify-between p-10 lg:flex">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-zinc-950">
              <Workflow size={19} strokeWidth={2.5} />
            </div>

            <span className="text-lg font-semibold tracking-tight text-white">
              Teamflow
            </span>
          </Link>

          <div className="max-w-lg">
            <p className="mb-5 text-sm font-medium text-zinc-400">
              WORK BETTER TOGETHER
            </p>

            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white">
              Everything your team needs to get work done.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
              Plan projects, manage tasks, collaborate with your team, and keep
              everything moving in one place.
            </p>
          </div>

          <p className="text-xs text-zinc-600">
            © 2026 Teamflow. All rights reserved.
          </p>
        </div>

        {/* Right side */}
        <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
          <div className="w-full max-w-[420px]">
            {/* Mobile logo */}
            <Link
              href="/"
              className="mb-10 flex items-center justify-center gap-2.5 lg:hidden"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white">
                <Workflow size={19} strokeWidth={2.5} />
              </div>

              <span className="text-lg font-semibold tracking-tight text-zinc-950">
                Teamflow
              </span>
            </Link>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Sign in to continue to your workspace.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(event) => event.preventDefault()}
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-800"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-950"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3.5 pr-11 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-300"
                />

                <label htmlFor="remember" className="text-sm text-zinc-500">
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Sign in
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs text-zinc-400">OR</span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <span className="text-base font-bold">G</span>
              Continue with Google
            </button>

            {/* Signup */}
            <p className="mt-8 text-center text-sm text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-zinc-950 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

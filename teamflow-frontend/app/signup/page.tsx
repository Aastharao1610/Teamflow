"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, EyeOff, Workflow } from "lucide-react";

const benefits = [
  "Create unlimited projects",
  "Collaborate with your team",
  "Track tasks and deadlines",
  "Keep everything organized",
];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left */}
        <div className="relative hidden overflow-hidden bg-zinc-950 p-10 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-zinc-950">
              <Workflow size={19} strokeWidth={2.5} />
            </div>

            <span className="text-lg font-semibold tracking-tight text-white">
              Teamflow
            </span>
          </Link>

          <div className="relative z-10 mt-auto mb-auto max-w-lg">
            <p className="mb-5 text-sm font-medium text-zinc-400">
              BUILT FOR TEAMS
            </p>

            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white">
              Bring your team&apos;s work together.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
              One simple place to plan projects, manage tasks, collaborate, and
              keep your team moving forward.
            </p>

            <div className="mt-10 space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800">
                    <Check size={12} />
                  </div>

                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-zinc-600">
            © 2026 Teamflow. All rights reserved.
          </p>
        </div>

        {/* Right */}
        <div className="flex min-h-screen items-center justify-center px-6 py-12">
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

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Get started with Teamflow today.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(event) => event.preventDefault()}
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Alex Johnson"
                  className="h-11 w-full rounded-lg border border-zinc-200 px-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Email
                </label>

                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-11 w-full rounded-lg border border-zinc-200 px-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="signup-password"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="h-11 w-full rounded-lg border border-zinc-200 px-3.5 pr-11 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-zinc-400">
                  Use at least 8 characters.
                </p>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-zinc-500"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    Privacy Policy
                  </button>
                  .
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Create account
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

            {/* Login */}
            <p className="mt-8 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-zinc-950 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

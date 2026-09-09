"use client";

import { useState } from "react";
import { Camera, Check, Loader2, Mail, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ProfileSettings() {
  const { showToast } = useToast();

  const [name, setName] = useState("Astha");
  const [email, setEmail] = useState("astha@teamflow.com");
  const [jobTitle, setJobTitle] = useState("Product Engineer");
  const [saving, setSaving] = useState(false);

  function handleSave() {
    if (!name.trim()) {
      showToast(
        "error",
        "Name required",
        "Please enter your full name before saving.",
      );
      return;
    }

    if (!email.trim()) {
      showToast(
        "error",
        "Email required",
        "Please enter your email address before saving.",
      );
      return;
    }

    setSaving(true);

    window.setTimeout(() => {
      setSaving(false);

      showToast(
        "success",
        "Profile updated",
        "Your profile information has been saved.",
      );
    }, 700);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-zinc-950">Profile</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Manage your personal information and profile.
        </p>
      </div>

      {/* Profile card */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">
            Personal information
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            This information will be visible to members of your workspace.
          </p>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* Avatar */}
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-800">
              Profile photo
            </label>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-lg font-semibold text-white">
                  A
                </div>

                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "info",
                      "Profile photo",
                      "Photo upload will be connected later.",
                    )
                  }
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-zinc-100 text-zinc-600 shadow-sm transition hover:bg-zinc-200"
                  aria-label="Change profile photo"
                >
                  <Camera size={13} />
                </button>
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-800">
                  Your profile photo
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  JPG, PNG or GIF. Maximum 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="profile-name"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Full name
            </label>

            <div className="relative sm:max-w-lg">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="profile-email"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Email address
            </label>

            <div className="relative sm:max-w-lg">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
              />
            </div>
          </div>

          {/* Job title */}
          <div>
            <label
              htmlFor="profile-job-title"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Job title
            </label>

            <input
              id="profile-job-title"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="e.g. Product Engineer"
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 sm:max-w-lg"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex h-9 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={14} />
                Save changes
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}

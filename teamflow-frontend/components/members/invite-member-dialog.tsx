"use client";

import { useState } from "react";
import { Check, Loader2, Mail, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type InviteMemberDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function InviteMemberDialog({ open, onClose }: InviteMemberDialogProps) {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  function resetForm() {
    setEmail("");
    setRole("Member");
    setError("");
  }

  function handleClose() {
    if (sending) return;

    resetForm();
    onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter an email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSending(true);

    window.setTimeout(() => {
      setSending(false);

      showToast(
        "success",
        "Invitation sent",
        `${trimmedEmail} has been invited as a ${role.toLowerCase()}.`,
      );

      resetForm();
      onClose();
    }, 700);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close invite dialog"
        onClick={handleClose}
        className="absolute inset-0"
      />

      <div className="relative w-full max-w-md rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">
              Invite member
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Add someone to your Teamflow workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={sending}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-5 py-5 sm:px-6">
            {/* Email */}
            <div>
              <label
                htmlFor="member-email"
                className="mb-2 block text-sm font-medium text-zinc-800"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  id="member-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="name@company.com"
                  disabled={sending}
                  className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-50 ${
                    error
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-50"
                      : "border-zinc-200 focus:border-zinc-400"
                  }`}
                />
              </div>

              {error && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {error}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="member-role"
                className="mb-2 block text-sm font-medium text-zinc-800"
              >
                Role
              </label>

              <select
                id="member-role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                disabled={sending}
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-50"
              >
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
                <option value="Viewer">Viewer</option>
              </select>

              <p className="mt-2 text-xs text-zinc-400">
                Members can work on projects and tasks. Admins can manage the
                workspace.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={sending}
              className="h-10 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={sending}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Send invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

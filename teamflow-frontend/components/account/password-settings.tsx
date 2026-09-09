"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PasswordSettings() {
  const { showToast } = useToast();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleUpdatePassword() {
    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      setError("New password must include uppercase and lowercase letters.");
      return;
    }

    if (!/\d/.test(newPassword)) {
      setError("New password must include at least one number.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    setError("");
    setSaving(true);

    window.setTimeout(() => {
      setSaving(false);

      showToast(
        "success",
        "Password updated",
        "Your account password has been changed successfully.",
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }, 700);
  }

  function handleCancel() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-zinc-950">Password</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Update your password to keep your account secure.
        </p>
      </div>

      {/* Change password */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
              <LockKeyhole size={17} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-900">
                Change password
              </h3>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Use a strong password that you don't use elsewhere.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Current password */}
          <PasswordField
            id="account-current-password"
            label="Current password"
            value={currentPassword}
            onChange={(value) => {
              setCurrentPassword(value);
              if (error) setError("");
            }}
            visible={showCurrent}
            onToggle={() => setShowCurrent((current) => !current)}
          />

          {/* New password */}
          <PasswordField
            id="account-new-password"
            label="New password"
            value={newPassword}
            onChange={(value) => {
              setNewPassword(value);
              if (error) setError("");
            }}
            visible={showNew}
            onToggle={() => setShowNew((current) => !current)}
          />

          {/* Confirm password */}
          <PasswordField
            id="account-confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value);
              if (error) setError("");
            }}
            visible={showConfirm}
            onToggle={() => setShowConfirm((current) => !current)}
          />

          {/* Requirements */}
          <div className="rounded-lg bg-zinc-50 p-4">
            <p className="text-xs font-medium text-zinc-700">
              Password requirements
            </p>

            <ul className="mt-2 space-y-1 text-xs text-zinc-500">
              <li className={newPassword.length >= 8 ? "text-emerald-600" : ""}>
                • At least 8 characters
              </li>

              <li
                className={
                  /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)
                    ? "text-emerald-600"
                    : ""
                }
              >
                • Include uppercase and lowercase letters
              </li>

              <li className={/\d/.test(newPassword) ? "text-emerald-600" : ""}>
                • Include at least one number
              </li>
            </ul>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
              <p className="text-xs font-medium text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="h-9 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={saving}
            className="flex h-9 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check size={14} />
                Update password
              </>
            )}
          </button>
        </div>
      </section>

      {/* Security note */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <p className="text-xs leading-5 text-zinc-500">
          After changing your password, you'll remain signed in on this device.
          Other active sessions may need to sign in again.
        </p>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-zinc-800"
      >
        {label}
      </label>

      <div className="relative sm:max-w-lg">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

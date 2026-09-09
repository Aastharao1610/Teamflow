"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Monitor,
  ShieldCheck,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SecuritySettings() {
  const { showToast } = useToast();

  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionAlerts, setSessionAlerts] = useState(true);

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  function handleChangePassword() {
    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordError("");
    setSavingPassword(true);

    window.setTimeout(() => {
      setSavingPassword(false);

      showToast(
        "success",
        "Password updated",
        "Your password has been changed successfully.",
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangePasswordOpen(false);
    }, 700);
  }

  function handleRevoke() {
    setRevoking(true);

    window.setTimeout(() => {
      setRevoking(false);
      setRevokeOpen(false);

      showToast(
        "success",
        "Session revoked",
        "The Windows PC session has been signed out.",
      );
    }, 700);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-zinc-950">Security</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Manage workspace security and account protection.
        </p>
      </div>

      {/* Security overview */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">
            Security overview
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Review the security features enabled for your workspace.
          </p>
        </div>

        <div className="divide-y divide-zinc-100">
          <SecurityRow
            icon={ShieldCheck}
            title="Two-factor authentication"
            description="Require an additional verification step when signing in."
            enabled={twoFactor}
            onChange={() => setTwoFactor((current) => !current)}
          />

          <SecurityRow
            icon={Monitor}
            title="New session alerts"
            description="Notify members when their account is accessed from a new device."
            enabled={sessionAlerts}
            onChange={() => setSessionAlerts((current) => !current)}
          />
        </div>
      </section>

      {/* Password */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
              <KeyRound size={17} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Password</h3>

              <p className="mt-1 text-xs text-zinc-500">
                Update your account password regularly to keep your account
                secure.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-medium text-zinc-800">Change password</p>

            <p className="mt-1 text-xs text-zinc-500">
              Last changed 30 days ago.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setPasswordError("");
              setChangePasswordOpen(true);
            }}
            className="h-9 w-full rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 sm:w-auto"
          >
            Change password
          </button>
        </div>
      </section>

      {/* Active sessions */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-zinc-900">
            Active sessions
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Devices currently signed in to your account.
          </p>
        </div>

        <div className="divide-y divide-zinc-100">
          {/* Current session */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                <Monitor size={17} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-800">
                  MacBook Pro
                </p>

                <p className="truncate text-xs text-zinc-500">
                  Chrome · Ahmedabad · Current session
                </p>
              </div>
            </div>

            <span className="shrink-0 text-xs font-medium text-emerald-600">
              Active
            </span>
          </div>

          {/* Other session */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                <Monitor size={17} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-800">
                  Windows PC
                </p>

                <p className="truncate text-xs text-zinc-500">
                  Edge · Mumbai · 2 days ago
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRevokeOpen(true)}
              className="shrink-0 text-xs font-medium text-red-600 transition hover:text-red-700"
            >
              Revoke
            </button>
          </div>
        </div>
      </section>

      {/* Change password modal */}
      {changePasswordOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Close password dialog"
            onClick={() => setChangePasswordOpen(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          />

          <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-[480px] sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 sm:px-6">
              <div>
                <h3 className="text-base font-semibold text-zinc-950">
                  Change password
                </h3>

                <p className="mt-1 text-xs text-zinc-500">
                  Choose a strong password for your account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setChangePasswordOpen(false)}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              <PasswordField
                id="current-password"
                label="Current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                visible={showCurrentPassword}
                onToggle={() => setShowCurrentPassword((current) => !current)}
              />

              <PasswordField
                id="new-password"
                label="New password"
                value={newPassword}
                onChange={(value) => {
                  setNewPassword(value);
                  if (passwordError) setPasswordError("");
                }}
                visible={showNewPassword}
                onToggle={() => setShowNewPassword((current) => !current)}
              />

              <PasswordField
                id="confirm-password"
                label="Confirm new password"
                value={confirmPassword}
                onChange={(value) => {
                  setConfirmPassword(value);
                  if (passwordError) setPasswordError("");
                }}
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((current) => !current)}
              />

              {passwordError && (
                <p className="text-xs font-medium text-red-500">
                  {passwordError}
                </p>
              )}

              <div className="rounded-lg bg-zinc-50 p-3">
                <p className="text-xs font-medium text-zinc-700">
                  Password requirements
                </p>

                <ul className="mt-2 space-y-1 text-xs text-zinc-500">
                  <li>• At least 8 characters</li>
                  <li>• Use a mix of letters and numbers</li>
                  <li>• Avoid easily guessed passwords</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 bg-zinc-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setChangePasswordOpen(false)}
                className="h-10 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={savingPassword}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingPassword ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckIcon />
                    Update password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke confirmation */}
      {revokeOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Close revoke dialog"
            onClick={() => setRevokeOpen(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          />

          <div className="relative w-full rounded-t-2xl bg-white shadow-2xl sm:max-w-[420px] sm:rounded-2xl">
            <div className="px-5 py-5 sm:px-6">
              <h3 className="text-base font-semibold text-zinc-950">
                Revoke session?
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                This will sign out the Windows PC session. You can sign in again
                from that device later.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 bg-zinc-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setRevokeOpen(false)}
                className="h-10 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRevoke}
                disabled={revoking}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {revoking ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Revoking...
                  </>
                ) : (
                  "Revoke session"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
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

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 pr-11 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function SecurityRow({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-800">{title}</p>

          <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={enabled}
        aria-label={title}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-zinc-900" : "bg-zinc-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function CheckIcon() {
  return <span className="text-sm">✓</span>;
}

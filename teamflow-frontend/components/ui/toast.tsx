"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

type ToastProps = {
  type: ToastType;
  title: string;
  description?: string;
  onClose: () => void;
};

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function Toast({ type, title, description, onClose }: ToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    const timer = window.setTimeout(onClose, 3500);

    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200/50">
      <div className="flex gap-3 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
          <Icon size={17} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-950">{title}</p>

          {description && (
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

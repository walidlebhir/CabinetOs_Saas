"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type SlideOverPanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function SlideOverPanel({
  open,
  onClose,
  title,
  subtitle,
  children,
}: SlideOverPanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50"
    >
      <button
        type="button"
        aria-label="Fermer le panneau"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default animate-in fade-in duration-200 bg-medos-navy/35 backdrop-blur-[2px]"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col animate-in slide-in-from-right duration-300 border-l border-medos-line bg-white shadow-2xl shadow-medos-navy/25">
        <header className="flex items-start justify-between gap-3 border-b border-medos-line px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-medos-navy">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-medos-slate">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-medos-slate transition-colors hover:bg-medos-frost hover:text-medos-navy"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>
      </aside>
    </div>
  );
}

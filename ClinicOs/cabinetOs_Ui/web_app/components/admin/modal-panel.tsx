"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ModalPanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function ModalPanel({
  open,
  onClose,
  title,
  subtitle,
  children,
}: ModalPanelProps) {
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
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
    >
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default animate-in fade-in duration-200 bg-medos-navy/35 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-lg animate-in zoom-in-95 fade-in duration-200 rounded-2xl border border-medos-line bg-white p-6 shadow-2xl shadow-medos-navy/25">
        <header className="flex items-start justify-between gap-3 border-b border-medos-line pb-4">
          <div className="min-w-0">
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
        <div className="pt-5">{children}</div>
      </div>
    </div>
  );
}
"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  isPending?: boolean;
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = "Annuler",
  tone = "primary",
  isPending = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, isPending]);

  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
    >
      <button
        type="button"
        aria-label="Fermer la fenêtre"
        onClick={isPending ? undefined : onClose}
        className="absolute inset-0 h-full w-full cursor-default animate-in fade-in duration-200 bg-medos-navy/35 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in duration-200 rounded-2xl border border-medos-line bg-white p-6 shadow-2xl shadow-medos-navy/25">
        <div className="flex items-start gap-3.5">
          <span
            className={
              tone === "danger"
                ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"
                : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-medos-frost text-medos-teal"
            }
          >
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-medos-navy">{title}</h2>
            {description && (
              <div className="mt-1.5 text-sm leading-relaxed text-medos-slate">
                {description}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            variant={tone === "danger" ? "secondary" : "primary"}
            onClick={onConfirm}
            disabled={isPending}
            className={
              tone === "danger"
                ? "border-red-200 bg-red-600 text-white hover:border-red-700 hover:bg-red-700"
                : undefined
            }
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Traitement…" : confirmLabel}
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

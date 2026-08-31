"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
import type { Secretaire } from "@/modules/admin/schema/types";

type SecretaireActions = {
  onView: () => void;
  onEdit: () => void;
  onCreateAccount?: () => void;
  onDelete: () => void;
};

type ActionsMenuProps = {
  secretaire: Secretaire;
  actions: SecretaireActions;
  canManageAccounts: boolean;
  disabled?: boolean;
};

export function SecretaireActionsMenu({
  secretaire,
  actions,
  canManageAccounts,
  disabled = false,
}: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 224; // w-56
    const menuHeightEstimate = 208;
    const left = Math.min(
      Math.max(rect.right - menuWidth, 8),
      window.innerWidth - menuWidth - 8
    );
    const below = rect.bottom + 6;
    setPosition({
      top:
        below + menuHeightEstimate > window.innerHeight
          ? Math.max(rect.top - menuHeightEstimate - 6, 8)
          : below,
      left,
    });
  }, [open]);

  const closeAndBlur = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: MouseEvent) => {
      if (
        menuRef.current?.contains(event.target as Node) ||
        buttonRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", closeAndBlur);
    window.addEventListener("scroll", closeAndBlur, true);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", closeAndBlur);
      window.removeEventListener("scroll", closeAndBlur, true);
    };
  }, [open]);

  const runAction = (action: () => void) => {
    setOpen(false);
    action();
  };

  const menuItemClass =
    "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-medos-ink transition-colors hover:bg-medos-frost hover:text-medos-teal-dark disabled:pointer-events-none disabled:opacity-50";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions pour ${secretaire.prenom} ${secretaire.nom}`}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-medos-slate transition-colors hover:border-medos-line hover:bg-medos-frost hover:text-medos-navy disabled:opacity-50"
      >
        <MoreHorizontal className="h-4.5 w-4.5" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: position.top, left: position.left }}
            className="fixed z-[70] w-56 overflow-hidden rounded-xl border border-medos-line bg-white py-1 shadow-lg shadow-medos-navy/15"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => runAction(actions.onView)}
              className={menuItemClass}
            >
              <Eye className="h-4 w-4 text-medos-teal" />
              Voir
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => runAction(actions.onEdit)}
              className={menuItemClass}
            >
              <Pencil className="h-4 w-4 text-medos-teal" />
              Modifier
            </button>

            {canManageAccounts && !secretaire.email && (
              <button
                type="button"
                role="menuitem"
                onClick={() =>
                  actions.onCreateAccount && runAction(actions.onCreateAccount)
                }
                className={menuItemClass}
              >
                <UserPlus className="h-4 w-4 text-medos-teal" />
                Créer un compte
              </button>
            )}

            <div className="my-1 border-t border-medos-line" />
            <button
              type="button"
              role="menuitem"
              onClick={() => runAction(actions.onDelete)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

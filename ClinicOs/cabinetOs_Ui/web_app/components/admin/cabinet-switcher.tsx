"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Building2, Check, ChevronDown, Settings } from "lucide-react";
import {
  clearSelectedCabinet,
  getSelectedCabinet,
  saveSelectedCabinet,
} from "@/lib/cabinet-storage";
import { getMyCabinets } from "@/modules/cabinet/service/cabinet.api";
import type { AdminCabinet } from "@/modules/cabinet/schema/types";

export function CabinetSwitcher({ email }: { email?: string }) {
  const [cabinets, setCabinets] = useState<AdminCabinet[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    getMyCabinets()
      .then((data) => {
        if (cancelled) return;
        setCabinets(data);
        setLoaded(true);
        const stored = getSelectedCabinet();
        const storedExists =
          stored && data.some((cabinet) => cabinet.id === stored.id);
        if (storedExists && stored) {
          saveSelectedCabinet({
            id: stored.id,
            nom: stored.nom,
            status: stored.status,
          });
          setSelectedId(stored.id);
        } else if (data.length > 0) {
          saveSelectedCabinet({
            id: data[0].id,
            nom: data[0].nom,
            status: data[0].status,
          });
          setSelectedId(data[0].id);
        } else {
          clearSelectedCabinet();
          setSelectedId(null);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [email]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (!email || !loaded) return null;

  const selected = cabinets.find((cabinet) => cabinet.id === selectedId);

  return (
    <div ref={menuRef} className="relative hidden sm:block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-lg border border-medos-line bg-white px-3 text-sm font-medium text-medos-navy transition-colors hover:border-medos-teal/40 hover:bg-medos-frost"
      >
        <Building2 className="h-4 w-4 text-medos-teal" />
        <span className="max-w-[140px] truncate lg:max-w-[200px]">
          {selected ? selected.nom : "Aucun cabinet"}
        </span>
        <ChevronDown className="h-4 w-4 text-medos-slate" />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute left-0 mt-2 w-72 overflow-hidden rounded-xl border border-medos-line bg-white shadow-lg shadow-medos-navy/10"
        >
          <p className="border-b border-medos-line px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-medos-slate">
            Mes cabinets ({cabinets.length})
          </p>

          {cabinets.length === 0 ? (
            <p className="px-4 py-3 text-sm text-medos-slate">
              Aucun cabinet configuré. Créez votre premier cabinet pour
              démarrer.
            </p>
          ) : (
            cabinets.map((cabinet) => (
              <button
                key={cabinet.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  saveSelectedCabinet({
                    id: cabinet.id,
                    nom: cabinet.nom,
                    status: cabinet.status,
                  });
                  setSelectedId(cabinet.id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-medium text-medos-ink transition-colors hover:bg-medos-frost hover:text-medos-teal-dark"
              >
                <span className="min-w-0">
                  <span className="block truncate">{cabinet.nom}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs font-normal text-medos-slate">
                    <span
                      className={
                        cabinet.status === "ACTIF"
                          ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                          : "h-1.5 w-1.5 rounded-full bg-slate-400"
                      }
                    />
                    {cabinet.specialite} ·{" "}
                    {cabinet.status === "ACTIF" ? "Actif" : "Inactif"}
                  </span>
                </span>
                {cabinet.id === selectedId && (
                  <Check className="h-4 w-4 shrink-0 text-medos-teal" />
                )}
              </button>
            ))
          )}

          <Link
            href="/admin-cabinet/parametres"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 border-t border-medos-line px-4 py-2.5 text-sm font-medium text-medos-ink transition-colors hover:bg-medos-frost hover:text-medos-teal-dark"
          >
            <Settings className="h-4 w-4" />
            Configurer mes cabinets
          </Link>
        </div>
      )}
    </div>
  );
}

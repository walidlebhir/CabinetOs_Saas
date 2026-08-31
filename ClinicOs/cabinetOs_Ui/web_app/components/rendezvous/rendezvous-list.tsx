"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarCheck,
  CalendarX2,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  RefreshCw,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import {
  annulerRdv,
  confirmerRdv,
  getMesRdvMedecin,
  getMesRdvPatient,
  getRdvCabinetAdmin,
  getRdvCabinetSecretaire,
  marquerAbsentRdv,
  remettreEnAttenteRdv,
  terminerRdv,
} from "@/modules/rendezvous/service/rendezvous.api";
import type {
  Rendezvous,
  RendezvousStatus,
} from "@/modules/rendezvous/schema/types";

type Mode = "admin" | "medecin" | "secretaire" | "patient";

const STATUS_STYLES: Record<RendezvousStatus, string> = {
  EN_ATTENTE: "border-amber-200 bg-amber-50 text-amber-700",
  CONFIRME: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ANNULE: "border-red-200 bg-red-50 text-red-600",
  TERMINE: "border-slate-200 bg-slate-100 text-slate-600",
  ABSENT: "border-violet-200 bg-violet-50 text-violet-700",
};

const STATUS_LABEL: Record<RendezvousStatus, string> = {
  EN_ATTENTE: "En attente",
  CONFIRME: "Confirmé",
  ANNULE: "Annulé",
  TERMINE: "Terminé",
  ABSENT: "Absent",
};

function formatDate(value: string): string {
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatHeure(value: string): string {
  return value?.slice(0, 5) ?? "—";
}

function sortByDate(list: Rendezvous[]): Rendezvous[] {
  return [...list].sort((a, b) =>
    `${a.dateRendezvous}${a.heureDebut}`.localeCompare(
      `${b.dateRendezvous}${b.heureDebut}`
    )
  );
}

export function RendezvousList({
  mode,
  cabinetId,
}: {
  mode: Mode;
  cabinetId?: string;
}) {
  const [items, setItems] = useState<Rendezvous[]>([]);
  const [phase, setPhase] = useState<"loading" | "ready" | "refreshing">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const getter = useCallback(() => {
    switch (mode) {
      case "admin":
        return getRdvCabinetAdmin(cabinetId as string);
      case "medecin":
        return getMesRdvMedecin();
      case "secretaire":
        return getRdvCabinetSecretaire();
      case "patient":
        return getMesRdvPatient();
    }
  }, [mode, cabinetId]);

  useEffect(() => {
    if (mode === "admin" && !cabinetId) return;
    let cancelled = false;
    getter()
      .then((data) => {
        if (!cancelled) {
          setItems(sortByDate(data));
          setError(null);
          setPhase("ready");
        }
      })
      .catch((cause) => {
        if (!cancelled) {
          setError(
            extractApiErrorMessage(cause, "Impossible de charger les rendez-vous.")
          );
          setPhase("ready");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [getter, mode, cabinetId]);

  async function refresh() {
    setPhase("refreshing");
    try {
      const data = await getter();
      setItems(sortByDate(data));
      setError(null);
    } catch (cause) {
      setError(
        extractApiErrorMessage(cause, "Impossible de charger les rendez-vous.")
      );
      toast.error(
        extractApiErrorMessage(cause, "Impossible de charger les rendez-vous.")
      );
    } finally {
      setPhase("ready");
    }
  }

  async function runAction(
    action: "confirmer" | "annuler" | "terminer" | "absent" | "attente",
    id: string
  ) {
    setBusyId(id);
    try {
      const fn = {
        confirmer: confirmerRdv,
        annuler: annulerRdv,
        terminer: terminerRdv,
        absent: marquerAbsentRdv,
        attente: remettreEnAttenteRdv,
      }[action];
      await fn(id);
      toast.success("Rendez-vous mis à jour.");
      await refresh();
    } catch (cause) {
      toast.error(extractApiErrorMessage(cause, "Action impossible."));
    } finally {
      setBusyId(null);
    }
  }

  const showActions = mode !== "patient";

  return (
    <div className="rounded-2xl border border-medos-line bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-medos-line px-5 py-4">
        <h2 className="text-base font-bold text-medos-navy">
          {items.length} rendez-vous
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={refresh}
          disabled={phase === "refreshing"}
        >
          {phase === "refreshing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Actualiser
        </Button>
      </div>

      <div className="divide-y divide-medos-line">
        {mode === "admin" && !cabinetId ? (
          <div className="px-6 py-12 text-center text-sm text-medos-slate">
            Sélectionnez un cabinet depuis la barre en haut pour afficher ses
            rendez-vous.
          </div>
        ) : phase === "loading" ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-medos-slate">
            <Loader2 className="h-5 w-5 animate-spin text-medos-teal" />
            Chargement…
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-medos-slate">
            Aucun rendez-vous.
          </div>
        ) : (
          items.map((rdv) => (
            <div
              key={rdv.id}
              className="flex flex-wrap items-center gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-medos-frost">
                  <CalendarCheck className="h-5 w-5 text-medos-teal" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-medos-navy">
                    {rdv.nomPatient ?? "Patient"}
                  </p>
                  <p className="text-xs text-medos-slate">
                    {formatDate(rdv.dateRendezvous)} · {formatHeure(rdv.heureDebut)} –{" "}
                    {formatHeure(rdv.heureFin)}
                  </p>
                </div>
              </div>

              <div className="min-w-[140px] text-xs text-medos-slate">
                <span className="block text-[10px] font-semibold uppercase tracking-wide">
                  Médecin
                </span>
                <span className="font-medium text-medos-navy">
                  {rdv.nomMedecin ?? "—"}
                </span>
              </div>

              {rdv.motif && (
                <div className="min-w-[120px] flex-1 text-xs text-medos-slate">
                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    Motif
                  </span>
                  <span className="block truncate">{rdv.motif}</span>
                </div>
              )}

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[rdv.status]}`}
              >
                {STATUS_LABEL[rdv.status]}
              </span>

              {showActions && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {rdv.status === "EN_ATTENTE" && (
                    <ActionButton
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      label="Confirmer"
                      tone="success"
                      loading={busyId === rdv.id}
                      onClick={() => runAction("confirmer", rdv.id)}
                    />
                  )}
                  {(rdv.status === "EN_ATTENTE" || rdv.status === "CONFIRME") && (
                    <ActionButton
                      icon={<CalendarX2 className="h-4 w-4" />}
                      label="Annuler"
                      tone="danger"
                      loading={busyId === rdv.id}
                      onClick={() => runAction("annuler", rdv.id)}
                    />
                  )}
                  {rdv.status === "CONFIRME" && (
                    <ActionButton
                      icon={<ClipboardCheck className="h-4 w-4" />}
                      label="Terminer"
                      loading={busyId === rdv.id}
                      onClick={() => runAction("terminer", rdv.id)}
                    />
                  )}
                  {rdv.status === "CONFIRME" && (
                    <ActionButton
                      icon={<Undo2 className="h-4 w-4" />}
                      label="Absent"
                      tone="warn"
                      loading={busyId === rdv.id}
                      onClick={() => runAction("absent", rdv.id)}
                    />
                  )}
                  {(rdv.status === "ANNULE" ||
                    rdv.status === "ABSENT" ||
                    rdv.status === "TERMINE") && (
                    <ActionButton
                      icon={<RefreshCw className="h-4 w-4" />}
                      label="Remettre en attente"
                      tone="ghost"
                      loading={busyId === rdv.id}
                      onClick={() => runAction("attente", rdv.id)}
                    />
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  loading,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  loading?: boolean;
  tone?: "default" | "success" | "danger" | "warn" | "ghost";
}) {
  const tones: Record<string, string> = {
    default:
      "border-medos-line text-medos-navy hover:border-medos-teal/40 hover:bg-medos-frost",
    success: "border-emerald-300 text-emerald-700 hover:bg-emerald-50",
    danger: "border-red-300 text-red-600 hover:bg-red-50",
    warn: "border-violet-300 text-violet-700 hover:bg-violet-50",
    ghost: "border-medos-line text-medos-slate hover:bg-slate-50",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${tones[tone]}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {label}
    </button>
  );
}

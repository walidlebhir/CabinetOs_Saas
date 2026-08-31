"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  Clock,
  Coffee,
  Loader2,
  Pencil,
  Power,
  RotateCw,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import {
  createMyPlanning,
  deleteMyDisponibilite,
  deleteMyIndisponibilite,
  getMyDisponibilites,
  getMyIndisponibilites,
  updateMyDisponibilite,
  updateMyIndisponibilite,
} from "@/modules/medecin/service/planning.api";
import {
  WEEK_DAYS,
  type Disponibilite,
  type Indisponibilite,
  type PlanningCreatePayload,
  type TypeIndisponibilite,
  type WeekDay,
} from "@/modules/admin/schema/types";
import { SlideOverPanel } from "@/components/admin/slide-over-panel";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PlanningBatchForm } from "@/components/planning/planning-batch-form";

type LoadPhase = "loading" | "ready" | "refreshing";

const DAY_SHORT: Record<WeekDay, string> = {
  LUNDI: "Lun",
  MARDI: "Mar",
  MERCREDI: "Mer",
  JEUDI: "Jeu",
  VENDREDI: "Ven",
  SAMEDI: "Sam",
  DIMANCHE: "Dim",
};

const TYPE_LABELS: Record<TypeIndisponibilite, string> = {
  CONGE: "Congé",
  URGENCE: "Urgence",
  FORMATION: "Formation",
  AUTRE: "Autre",
};

const TYPE_BADGES: Record<TypeIndisponibilite, string> = {
  CONGE: "border-sky-200 bg-sky-50 text-sky-700",
  URGENCE: "border-red-200 bg-red-50 text-red-700",
  FORMATION: "border-violet-200 bg-violet-50 text-violet-700",
  AUTRE: "border-slate-200 bg-slate-50 text-slate-600",
};

const CRENEAU_OPTIONS = [15, 20, 30, 45, 60];

function formatTime(value: string | null): string {
  return value ? `${value.slice(0, 5)}` : "—";
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatPeriod(debutIso: string, finIso: string): string {
  const debut = new Date(debutIso);
  const fin = new Date(finIso);
  const sameDay = debut.toDateString() === fin.toDateString();
  const debutLabel = dateFormatter.format(debut);
  const finLabel = dateFormatter.format(fin);
  if (sameDay) {
    return `${debutLabel} · ${timeFormatter.format(debut)} → ${timeFormatter.format(fin)}`;
  }
  return `${debutLabel} ${timeFormatter.format(debut)} → ${finLabel} ${timeFormatter.format(fin)}`;
}

type DispoFormState = {
  joursemaine: WeekDay;
  heurDebut: string;
  heurFin: string;
  dureCreneau: number;
  pauseActive: boolean;
  pauseDebut: string;
  pauseFin: string;
  actif: boolean;
};

const defaultDispoForm: DispoFormState = {
  joursemaine: "LUNDI",
  heurDebut: "09:00",
  heurFin: "17:00",
  dureCreneau: 30,
  pauseActive: false,
  pauseDebut: "12:00",
  pauseFin: "13:00",
  actif: true,
};

type IndispoFormState = {
  type: TypeIndisponibilite;
  dateDebut: string;
  dateFin: string;
  motif: string;
};

const defaultIndispoForm: IndispoFormState = {
  type: "CONGE",
  dateDebut: "",
  dateFin: "",
  motif: "",
};

function validateDispoForm(form: DispoFormState): string | null {
  if (form.heurFin <= form.heurDebut) {
    return "L'heure de fin doit être après l'heure de début.";
  }
  if (
    !Number.isInteger(form.dureCreneau) ||
    form.dureCreneau < 5 ||
    form.dureCreneau > 240
  ) {
    return "La durée du créneau doit être entre 5 et 240 minutes.";
  }
  if (form.pauseActive) {
    if (form.pauseFin <= form.pauseDebut) {
      return "La fin de la pause doit être après le début de la pause.";
    }
    if (form.pauseDebut < form.heurDebut || form.pauseFin > form.heurFin) {
      return "La pause doit être comprise dans les horaires de travail.";
    }
  }
  return null;
}

function validateIndispoForm(form: IndispoFormState): string | null {
  if (!form.dateDebut || !form.dateFin) {
    return "Les dates de début et de fin sont obligatoires.";
  }
  if (new Date(form.dateFin) <= new Date(form.dateDebut)) {
    return "La date de fin doit être après la date de début.";
  }
  if (new Date(form.dateDebut) < new Date()) {
    return "La date de début ne peut pas être dans le passé.";
  }
  if (form.motif.length > 255) {
    return "Le motif ne doit pas dépasser 255 caractères.";
  }
  return null;
}

export function MedecinPlanningManager() {
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);
  const [indisponibilites, setIndisponibilites] = useState<Indisponibilite[]>(
    []
  );
  const [planningPhase, setPlanningPhase] = useState<LoadPhase>("loading");
  const [refreshTick, setRefreshTick] = useState(0);

  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const [batchOpen, setBatchOpen] = useState(false);

  const [dispoPanel, setDispoPanel] = useState<
    { mode: "edit"; existing: Disponibilite } | null
  >(null);
  const [dispoForm, setDispoForm] = useState<DispoFormState>(defaultDispoForm);

  const [indispoPanel, setIndispoPanel] = useState<
    { mode: "edit"; existing: Indisponibilite } | null
  >(null);
  const [indispoForm, setIndispoForm] =
    useState<IndispoFormState>(defaultIndispoForm);

  const [deleteTarget, setDeleteTarget] = useState<
    | { kind: "dispo"; item: Disponibilite }
    | { kind: "indispo"; item: Indisponibilite }
    | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    const loadPlanning = async () => {
      setPlanningPhase((prev) =>
        prev === "ready" || prev === "refreshing" ? "refreshing" : "loading"
      );
      try {
        const [dipos, indipos] = await Promise.all([
          getMyDisponibilites(),
          getMyIndisponibilites(),
        ]);
        if (cancelled) return;
        setDisponibilites(dipos);
        setIndisponibilites(indipos);
        setPlanningPhase("ready");
      } catch (error) {
        if (cancelled) return;
        setDisponibilites([]);
        setIndisponibilites([]);
        setPlanningPhase("ready");
        toast.error(
          extractApiErrorMessage(error, "Impossible de charger votre planning.")
        );
      }
    };
    loadPlanning();
    return () => {
      cancelled = true;
    };
  }, [refreshTick]);

  const refreshPlanning = useCallback(() => {
    setRefreshTick((tick) => tick + 1);
  }, []);

  const openEditDispo = (item: Disponibilite) => {
    setDispoForm({
      joursemaine: item.joursemaine,
      heurDebut: item.heurDebut.slice(0, 5),
      heurFin: item.heurFin.slice(0, 5),
      dureCreneau: item.dureCreneau,
      pauseActive: item.pauseDebut != null,
      pauseDebut: item.pauseDebut ? item.pauseDebut.slice(0, 5) : "12:00",
      pauseFin: item.pauseFin ? item.pauseFin.slice(0, 5) : "13:00",
      actif: item.actif,
    });
    setDispoPanel({ mode: "edit", existing: item });
  };

  const openEditIndispo = (item: Indisponibilite) => {
    setIndispoForm({
      type: item.type,
      dateDebut: item.dateDebut.slice(0, 16),
      dateFin: item.dateFin.slice(0, 16),
      motif: item.motif ?? "",
    });
    setIndispoPanel({ mode: "edit", existing: item });
  };

  const handleSubmitBatch = async (payload: PlanningCreatePayload) => {
    if (pendingKey) return;
    const key = "submit-planning";
    setPendingKey(key);
    try {
      await createMyPlanning(payload);
      toast.success("Planning enregistré avec succès.");
      setBatchOpen(false);
      refreshPlanning();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "Échec de l'enregistrement du planning.")
      );
    } finally {
      setPendingKey(null);
    }
  };

  const handleToggleDispo = async (item: Disponibilite) => {
    if (pendingKey) return;
    const key = `toggle-${item.id}`;
    setPendingKey(key);
    try {
      await updateMyDisponibilite({
        id: item.id,
        actif: !item.actif,
      });
      toast.success(item.actif ? "Horaire désactivé." : "Horaire activé.");
      refreshPlanning();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Échec de la mise à jour."));
    } finally {
      setPendingKey(null);
    }
  };

  const handleSubmitDispo = async () => {
    if (!dispoPanel || pendingKey) return;
    const validationError = validateDispoForm(dispoForm);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    const key = "submit-dispo";
    setPendingKey(key);

    const basePayload = {
      joursemaine: dispoForm.joursemaine,
      heurDebut: dispoForm.heurDebut,
      heurFin: dispoForm.heurFin,
      dureCreneau: dispoForm.dureCreneau,
      pauseDebut: dispoForm.pauseActive ? dispoForm.pauseDebut : null,
      pauseFin: dispoForm.pauseActive ? dispoForm.pauseFin : null,
      actif: dispoForm.actif,
    };

    try {
      const existing = dispoPanel.existing;
      const pauseRemoved =
        existing.pauseDebut != null && !dispoForm.pauseActive;
      if (pauseRemoved) {
        await deleteMyDisponibilite(existing.id);
        await createMyPlanning({
          disponibilites: [
            {
              joursemaine: basePayload.joursemaine,
              heurDebut: basePayload.heurDebut,
              heurFin: basePayload.heurFin,
              dureCreneau: basePayload.dureCreneau,
              pauseDebut: basePayload.pauseDebut,
              pauseFin: basePayload.pauseFin,
              actif: basePayload.actif,
            },
          ],
        });
      } else {
        await updateMyDisponibilite({
          id: existing.id,
          ...basePayload,
        });
      }
      toast.success("Horaire mis à jour.");
      setDispoPanel(null);
      refreshPlanning();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "Échec de l'enregistrement de l'horaire.")
      );
    } finally {
      setPendingKey(null);
    }
  };

  const handleSubmitIndispo = async () => {
    if (!indispoPanel || pendingKey) return;
    const validationError = validateIndispoForm(indispoForm);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    const key = "submit-indispo";
    setPendingKey(key);

    const motifValue = indispoForm.motif.trim();

    try {
      await updateMyIndisponibilite({
        id: indispoPanel.existing.id,
        dateDebut: indispoForm.dateDebut,
        dateFin: indispoForm.dateFin,
        motif: motifValue.length > 0 ? motifValue : "",
        type: indispoForm.type,
      });
      toast.success("Absence mise à jour.");
      setIndispoPanel(null);
      refreshPlanning();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "Échec de l'enregistrement de l'absence.")
      );
    } finally {
      setPendingKey(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || pendingKey) return;
    const key = "delete";
    setPendingKey(key);
    try {
      if (deleteTarget.kind === "dispo") {
        await deleteMyDisponibilite(deleteTarget.item.id);
        toast.success("Horaire supprimé.");
      } else {
        await deleteMyIndisponibilite(deleteTarget.item.id);
        toast.success("Absence supprimée.");
      }
      setDeleteTarget(null);
      refreshPlanning();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Échec de la suppression."));
    } finally {
      setPendingKey(null);
    }
  };

  const daysWithSlots = useMemo(() => {
    const map = new Map<WeekDay, Disponibilite[]>();
    for (const day of WEEK_DAYS) map.set(day, []);
    for (const dispo of disponibilites) {
      map.get(dispo.joursemaine)?.push(dispo);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.heurDebut.localeCompare(b.heurDebut));
    }
    return WEEK_DAYS.map((day) => ({ day, items: map.get(day) ?? [] }));
  }, [disponibilites]);

  const sortedIndisponibilites = useMemo(
    () =>
      [...indisponibilites].sort((a, b) =>
        a.dateDebut.localeCompare(b.dateDebut)
      ),
    [indisponibilites]
  );

  const busy = pendingKey !== null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
            Mon agenda
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
            Mon planning
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-medos-slate">
            Configurez vos horaires hebdomadaires et déclarez vos absences.
            Ces informations sont visibles par votre cabinet.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-medos-line bg-white px-3.5 py-2 text-sm font-medium text-medos-navy">
          <Stethoscope className="h-4 w-4 text-medos-teal" />
          {disponibilites[0]?.nomMedecin ??
            indisponibilites[0]?.nomMedecin ??
            "Mon compte médecin"}
        </span>
      </div>

      {planningPhase !== "loading" && (
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {daysWithSlots.map(({ day, items }) => {
            const activeCount = items.filter((item) => item.actif).length;
            const covered = activeCount > 0;
            return (
              <div
                key={day}
                title={
                  covered
                    ? `${activeCount} horaire${activeCount > 1 ? "s" : ""} actif${activeCount > 1 ? "s" : ""}`
                    : "Aucun horaire actif"
                }
                className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-2.5 ${
                  covered
                    ? "border-medos-teal/25 bg-medos-frost"
                    : "border-medos-line bg-white"
                }`}
              >
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide ${
                    covered ? "text-medos-teal" : "text-medos-slate/70"
                  }`}
                >
                  {DAY_SHORT[day]}
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    covered ? "bg-medos-teal" : "bg-medos-line"
                  }`}
                />
              </div>
            );
          })}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-medos-line bg-white">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-medos-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4.5 w-4.5 text-medos-teal" />
            <h2 className="text-base font-bold text-medos-navy">
              Mes horaires hebdomadaires
            </h2>
            {planningPhase === "refreshing" && (
              <Loader2 className="h-4 w-4 animate-spin text-medos-slate" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="link"
              size="sm"
              onClick={refreshPlanning}
              disabled={busy || planningPhase === "loading"}
              aria-label="Actualiser mon planning"
            >
              <RotateCw
                className={`h-4 w-4 ${planningPhase === "refreshing" ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setBatchOpen(true)}
              disabled={busy}
            >
              <CalendarPlus className="h-4 w-4" />
              Ajouter au planning
            </Button>
          </div>
        </header>

        {planningPhase === "loading" ? (
          <div className="flex items-center justify-center px-6 py-14 text-sm text-medos-slate">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement de votre planning…
          </div>
        ) : disponibilites.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-medos-navy">
              Aucun horaire configuré pour le moment
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-medos-slate">
              Définissez vos jours et plages horaires de consultation pour que
              vos patients puissent prendre rendez-vous.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-medos-line/70">
            {daysWithSlots
              .filter(({ items }) => items.length > 0)
              .map(({ day, items }) => (
                <div key={day} className="px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                    {DAY_SHORT[day]}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3.5 py-3 ${
                          item.actif
                            ? "border-medos-line bg-medos-frost/40"
                            : "border-medos-line/60 bg-slate-50/60 opacity-75"
                        }`}
                      >
                        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="text-sm font-semibold tabular-nums text-medos-ink">
                            {formatTime(item.heurDebut)} –{" "}
                            {formatTime(item.heurFin)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-medos-slate">
                            <Clock className="h-3.5 w-3.5" />
                            Créneaux de {item.dureCreneau} min
                          </span>
                          {item.pauseDebut && item.pauseFin && (
                            <span className="inline-flex items-center gap-1 text-xs text-medos-slate">
                              <Coffee className="h-3.5 w-3.5" />
                              Pause {formatTime(item.pauseDebut)} –{" "}
                              {formatTime(item.pauseFin)}
                            </span>
                          )}
                          {!item.actif && (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                              Inactif
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title={busy ? "" : "Activer / désactiver"}
                            onClick={() => handleToggleDispo(item)}
                            disabled={busy}
                            aria-label="Activer ou désactiver cet horaire"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-medos-slate transition-colors hover:bg-medos-frost hover:text-medos-teal disabled:pointer-events-none disabled:opacity-40"
                          >
                            <Power className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title={busy ? "" : "Modifier"}
                            onClick={() => openEditDispo(item)}
                            disabled={busy}
                            aria-label="Modifier cet horaire"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-medos-slate transition-colors hover:bg-medos-frost hover:text-medos-navy disabled:pointer-events-none disabled:opacity-40"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title={busy ? "" : "Supprimer"}
                            onClick={() =>
                              setDeleteTarget({ kind: "dispo", item })
                            }
                            disabled={busy}
                            aria-label="Supprimer cet horaire"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-medos-slate transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-medos-line bg-white">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-medos-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="h-4.5 w-4.5 text-medos-teal" />
            <h2 className="text-base font-bold text-medos-navy">
              Mes absences &amp; indisponibilités
            </h2>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setBatchOpen(true)}
            disabled={busy}
          >
            Déclarer une absence
          </Button>
        </header>

        {sortedIndisponibilites.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-medos-navy">
              Aucune absence programmée
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-medos-slate">
              Congés, formations ou urgences : bloquez ici les périodes où vous
              n&apos;êtes pas disponible.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-medos-line/70">
            {sortedIndisponibilites.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${TYPE_BADGES[item.type]}`}
                  >
                    {TYPE_LABELS[item.type]}
                  </span>
                  <span className="text-sm font-medium tabular-nums text-medos-ink">
                    {formatPeriod(item.dateDebut, item.dateFin)}
                  </span>
                  {item.motif && (
                    <span className="max-w-64 truncate text-xs text-medos-slate">
                      {item.motif}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditIndispo(item)}
                    disabled={busy}
                    aria-label="Modifier cette absence"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-medos-slate transition-colors hover:bg-medos-frost hover:text-medos-navy disabled:pointer-events-none disabled:opacity-40"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ kind: "indispo", item })}
                    disabled={busy}
                    aria-label="Supprimer cette absence"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-medos-slate transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <SlideOverPanel
        open={batchOpen}
        onClose={() => {
          if (!busy) setBatchOpen(false);
        }}
        title="Ajouter au planning"
      >
        <PlanningBatchForm
          submitting={pendingKey === "submit-planning"}
          onSubmit={(payload) => handleSubmitBatch(payload)}
        />
      </SlideOverPanel>

      <SlideOverPanel
        open={dispoPanel !== null}
        onClose={() => {
          if (!busy) setDispoPanel(null);
        }}
        title="Modifier l'horaire"
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmitDispo();
          }}
        >
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
              Jour de la semaine
            </span>
            <select
              value={dispoForm.joursemaine}
              onChange={(event) =>
                setDispoForm((form) => ({
                  ...form,
                  joursemaine: event.target.value as WeekDay,
                }))
              }
              className="h-11 w-full rounded-lg border border-medos-line bg-white px-3 text-sm text-medos-ink focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40"
            >
              {WEEK_DAYS.map((day) => (
                <option key={day} value={day}>
                  {DAY_SHORT[day]}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                Début
              </span>
              <Input
                type="time"
                value={dispoForm.heurDebut}
                onChange={(event) =>
                  setDispoForm((form) => ({
                    ...form,
                    heurDebut: event.target.value,
                  }))
                }
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                Fin
              </span>
              <Input
                type="time"
                value={dispoForm.heurFin}
                onChange={(event) =>
                  setDispoForm((form) => ({
                    ...form,
                    heurFin: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
              Durée des créneaux (minutes)
            </span>
            <select
              value={dispoForm.dureCreneau}
              onChange={(event) =>
                setDispoForm((form) => ({
                  ...form,
                  dureCreneau: Number(event.target.value),
                }))
              }
              className="h-11 w-full rounded-lg border border-medos-line bg-white px-3 text-sm text-medos-ink focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40"
            >
              {CRENEAU_OPTIONS.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} min
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-xl border border-medos-line bg-medos-frost/40 p-3.5">
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={dispoForm.pauseActive}
                onChange={(event) =>
                  setDispoForm((form) => ({
                    ...form,
                    pauseActive: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-medos-teal"
              />
              <span className="flex items-center gap-1.5 text-sm font-medium text-medos-ink">
                <Coffee className="h-4 w-4 text-medos-teal" />
                Pause déjeuner
              </span>
            </label>
            {dispoForm.pauseActive && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Input
                  type="time"
                  value={dispoForm.pauseDebut}
                  onChange={(event) =>
                    setDispoForm((form) => ({
                      ...form,
                      pauseDebut: event.target.value,
                    }))
                  }
                  aria-label="Début de la pause"
                />
                <Input
                  type="time"
                  value={dispoForm.pauseFin}
                  onChange={(event) =>
                    setDispoForm((form) => ({
                      ...form,
                      pauseFin: event.target.value,
                    }))
                  }
                  aria-label="Fin de la pause"
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={dispoForm.actif}
              onChange={(event) =>
                setDispoForm((form) => ({
                  ...form,
                  actif: event.target.checked,
                }))
              }
              className="h-4 w-4 accent-medos-teal"
            />
            <span className="text-sm font-medium text-medos-ink">
              Horaire actif (ouvert aux rendez-vous)
            </span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" disabled={busy}>
              {pendingKey === "submit-dispo" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDispoPanel(null)}
              disabled={busy}
            >
              Annuler
            </Button>
          </div>
        </form>
      </SlideOverPanel>

      <SlideOverPanel
        open={indispoPanel !== null}
        onClose={() => {
          if (!busy) setIndispoPanel(null);
        }}
        title="Modifier l'absence"
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmitIndispo();
          }}
        >
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
              Type
            </span>
            <select
              value={indispoForm.type}
              onChange={(event) =>
                setIndispoForm((form) => ({
                  ...form,
                  type: event.target.value as TypeIndisponibilite,
                }))
              }
              className="h-11 w-full rounded-lg border border-medos-line bg-white px-3 text-sm text-medos-ink focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40"
            >
              {(["CONGE", "URGENCE", "FORMATION", "AUTRE"] as TypeIndisponibilite[]).map(
                (type) => (
                  <option key={type} value={type}>
                    {TYPE_LABELS[type]}
                  </option>
                )
              )}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                Début
              </span>
              <Input
                type="datetime-local"
                value={indispoForm.dateDebut}
                onChange={(event) =>
                  setIndispoForm((form) => ({
                    ...form,
                    dateDebut: event.target.value,
                  }))
                }
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                Fin
              </span>
              <Input
                type="datetime-local"
                value={indispoForm.dateFin}
                onChange={(event) =>
                  setIndispoForm((form) => ({
                    ...form,
                    dateFin: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
              Motif (facultatif)
            </span>
            <textarea
              value={indispoForm.motif}
              maxLength={255}
              rows={3}
              placeholder="Ex. : congrès de cardiologie"
              onChange={(event) =>
                setIndispoForm((form) => ({
                  ...form,
                  motif: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-medos-line bg-white px-3 py-2.5 text-sm text-medos-ink placeholder:text-medos-slate/60 focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40"
            />
          </label>

          <p className="rounded-lg bg-sky-50 px-3 py-2.5 text-xs leading-relaxed text-sky-800">
            Les périodes passées sont refusées : l&apos;absence doit commencer
            dans le futur et ne pas chevaucher une absence existante.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" disabled={busy}>
              {pendingKey === "submit-indispo" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIndispoPanel(null)}
              disabled={busy}
            >
              Annuler
            </Button>
          </div>
        </form>
      </SlideOverPanel>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleConfirmDelete()}
        tone="danger"
        confirmLabel="Supprimer"
        isPending={pendingKey === "delete"}
        title={
          deleteTarget?.kind === "dispo"
            ? "Supprimer cet horaire ?"
            : "Supprimer cette absence ?"
        }
        description={
          deleteTarget?.kind === "dispo"
            ? `Le créneau du ${DAY_SHORT[deleteTarget.item.joursemaine]} (${formatTime(deleteTarget.item.heurDebut)} – ${formatTime(deleteTarget.item.heurFin)}) sera supprimé définitivement de votre planning.`
            : "Cette période d'indisponibilité sera retirée de votre planning."
        }
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { CalendarDays, CalendarPlus, Coffee, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TYPE_INDISPONIBILITES,
  WEEK_DAYS,
  type PlanningCreatePayload,
  type TypeIndisponibilite,
  type WeekDay,
} from "@/modules/admin/schema/types";

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

const CRENEAU_OPTIONS = [15, 20, 30, 45, 60];

type DispoRow = {
  uid: number;
  joursemaine: WeekDay;
  heurDebut: string;
  heurFin: string;
  dureCreneau: number;
  pauseActive: boolean;
  pauseDebut: string;
  pauseFin: string;
};

type IndispoRow = {
  uid: number;
  type: TypeIndisponibilite;
  dateDebut: string;
  dateFin: string;
  motif: string;
};

function nowLocalInput(offsetMinutes = 0): string {
  const date = new Date(Date.now() + offsetMinutes * 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const SELECT_CLASS =
  "h-11 w-full rounded-lg border border-medos-line bg-white px-3 text-sm text-medos-ink focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40";

let uidCounter = 0;

function nextUid(): number {
  return ++uidCounter;
}

export function PlanningBatchForm({
  submitting = false,
  onSubmit,
}: {
  submitting?: boolean;
  onSubmit: (payload: PlanningCreatePayload) => void | Promise<void>;
}) {
  const [dispoRows, setDispoRows] = useState<DispoRow[]>([
    {
      uid: nextUid(),
      joursemaine: "LUNDI",
      heurDebut: "09:00",
      heurFin: "17:00",
      dureCreneau: 30,
      pauseActive: false,
      pauseDebut: "12:00",
      pauseFin: "13:00",
    },
  ]);
  const [indispoRows, setIndispoRows] = useState<IndispoRow[]>([]);

  const addDispoRow = () => {
    setDispoRows((rows) => [
      ...rows,
      {
        uid: nextUid(),
        joursemaine: "LUNDI",
        heurDebut: "09:00",
        heurFin: "17:00",
        dureCreneau: 30,
        pauseActive: false,
        pauseDebut: "12:00",
        pauseFin: "13:00",
      },
    ]);
  };

  const addIndispoRow = () => {
    setIndispoRows((rows) => [
      ...rows,
      {
        uid: nextUid(),
        type: "CONGE",
        dateDebut: nowLocalInput(30),
        dateFin: nowLocalInput(30 + 8 * 60),
        motif: "",
      },
    ]);
  };

  const updateDispoRow = (uid: number, patch: Partial<DispoRow>) => {
    setDispoRows((rows) =>
      rows.map((row) => (row.uid === uid ? { ...row, ...patch } : row))
    );
  };

  const updateIndispoRow = (uid: number, patch: Partial<IndispoRow>) => {
    setIndispoRows((rows) =>
      rows.map((row) => (row.uid === uid ? { ...row, ...patch } : row))
    );
  };

  const validate = (): string | null => {
    for (const row of dispoRows) {
      if (row.heurFin <= row.heurDebut) {
        return `Horaire du ${DAY_SHORT[row.joursemaine]} : l'heure de fin doit être après l'heure de début.`;
      }
      if (
        !Number.isInteger(row.dureCreneau) ||
        row.dureCreneau < 5 ||
        row.dureCreneau > 240
      ) {
        return `Horaire du ${DAY_SHORT[row.joursemaine]} : la durée du créneau doit être entre 5 et 240 minutes.`;
      }
      if (row.pauseActive) {
        if (row.pauseFin <= row.pauseDebut) {
          return `Pause du ${DAY_SHORT[row.joursemaine]} : la fin de la pause doit être après le début.`;
        }
        if (row.pauseDebut < row.heurDebut || row.pauseFin > row.heurFin) {
          return `Pause du ${DAY_SHORT[row.joursemaine]} : elle doit être comprise dans les horaires de travail.`;
        }
      }
    }
    for (const row of indispoRows) {
      if (!row.dateDebut || !row.dateFin) {
        return "Absence : les dates de début et de fin sont obligatoires.";
      }
      if (new Date(row.dateFin) <= new Date(row.dateDebut)) {
        return "Absence : la date de fin doit être après la date de début.";
      }
      if (new Date(row.dateDebut) < new Date()) {
        return "Absence : la date de début ne peut pas être dans le passé.";
      }
      if (row.motif.length > 255) {
        return "Absence : le motif ne doit pas dépasser 255 caractères.";
      }
    }
    if (dispoRows.length === 0 && indispoRows.length === 0) {
      return "Ajoutez au moins un horaire ou une absence.";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload: PlanningCreatePayload = {
      disponibilites: dispoRows.map((row) => ({
        joursemaine: row.joursemaine,
        heurDebut: row.heurDebut,
        heurFin: row.heurFin,
        dureCreneau: row.dureCreneau,
        pauseDebut: row.pauseActive ? row.pauseDebut : null,
        pauseFin: row.pauseActive ? row.pauseFin : null,
        actif: true,
      })),
      indisponibilites: indispoRows.map((row) => ({
        dateDebut: row.dateDebut,
        dateFin: row.dateFin,
        motif: row.motif.trim().length > 0 ? row.motif.trim() : null,
        type: row.type,
      })),
    };

    await onSubmit(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-medos-navy">
            <CalendarPlus className="h-4 w-4 text-medos-teal" />
            Disponibilités hebdomadaires
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addDispoRow}
            disabled={submitting}
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>

        {dispoRows.length === 0 && (
          <p className="rounded-lg bg-medos-frost/60 px-3 py-2.5 text-xs text-medos-slate">
            Aucun horaire : ajoutez au moins une ligne ou passez aux absences.
          </p>
        )}

        <ul className="space-y-3">
          {dispoRows.map((row, index) => (
            <li
              key={row.uid}
              className="space-y-3 rounded-xl border border-medos-line bg-medos-frost/30 p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                  Horaire {index + 1}
                </span>
                <button
                  type="button"
                  aria-label="Retirer cet horaire"
                  disabled={submitting}
                  onClick={() =>
                    setDispoRows((rows) => rows.filter((r) => r.uid !== row.uid))
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-medos-slate transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                    Jour
                  </span>
                  <select
                    value={row.joursemaine}
                    onChange={(event) =>
                      updateDispoRow(row.uid, {
                        joursemaine: event.target.value as WeekDay,
                      })
                    }
                    className={SELECT_CLASS}
                  >
                    {WEEK_DAYS.map((day) => (
                      <option key={day} value={day}>
                        {DAY_SHORT[day]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                    Début
                  </span>
                  <Input
                    type="time"
                    value={row.heurDebut}
                    onChange={(event) =>
                      updateDispoRow(row.uid, { heurDebut: event.target.value })
                    }
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                    Fin
                  </span>
                  <Input
                    type="time"
                    value={row.heurFin}
                    onChange={(event) =>
                      updateDispoRow(row.uid, { heurFin: event.target.value })
                    }
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                    Créneau
                  </span>
                  <select
                    value={row.dureCreneau}
                    onChange={(event) =>
                      updateDispoRow(row.uid, {
                        dureCreneau: Number(event.target.value),
                      })
                    }
                    className={SELECT_CLASS}
                  >
                    {CRENEAU_OPTIONS.map((minutes) => (
                      <option key={minutes} value={minutes}>
                        {minutes} min
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-lg border border-medos-line bg-white p-3">
                <label className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={row.pauseActive}
                    onChange={(event) =>
                      updateDispoRow(row.uid, {
                        pauseActive: event.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-medos-teal"
                  />
                  <span className="flex items-center gap-1.5 text-sm font-medium text-medos-ink">
                    <Coffee className="h-4 w-4 text-medos-teal" />
                    Pause déjeuner
                  </span>
                </label>
                {row.pauseActive && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Input
                      type="time"
                      value={row.pauseDebut}
                      aria-label="Début de la pause"
                      onChange={(event) =>
                        updateDispoRow(row.uid, {
                          pauseDebut: event.target.value,
                        })
                      }
                    />
                    <Input
                      type="time"
                      value={row.pauseFin}
                      aria-label="Fin de la pause"
                      onChange={(event) =>
                        updateDispoRow(row.uid, { pauseFin: event.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-medos-navy">
            <CalendarDays className="h-4 w-4 text-medos-teal" />
            Absences &amp; indisponibilités
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addIndispoRow}
            disabled={submitting}
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>

        {indispoRows.length === 0 && (
          <p className="rounded-lg bg-medos-frost/60 px-3 py-2.5 text-xs text-medos-slate">
            Facultatif : déclarez ici vos congés, formations ou urgences.
          </p>
        )}

        <ul className="space-y-3">
          {indispoRows.map((row, index) => (
            <li
              key={row.uid}
              className="space-y-3 rounded-xl border border-medos-line bg-medos-frost/30 p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                  Absence {index + 1}
                </span>
                <button
                  type="button"
                  aria-label="Retirer cette absence"
                  disabled={submitting}
                  onClick={() =>
                    setIndispoRows((rows) =>
                      rows.filter((r) => r.uid !== row.uid)
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-medos-slate transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                    Type
                  </span>
                  <select
                    value={row.type}
                    onChange={(event) =>
                      updateIndispoRow(row.uid, {
                        type: event.target.value as TypeIndisponibilite,
                      })
                    }
                    className={SELECT_CLASS}
                  >
                    {TYPE_INDISPONIBILITES.map((type) => (
                      <option key={type} value={type}>
                        {TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                    Début
                  </span>
                  <Input
                    type="datetime-local"
                    value={row.dateDebut}
                    onChange={(event) =>
                      updateIndispoRow(row.uid, {
                        dateDebut: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                    Fin
                  </span>
                  <Input
                    type="datetime-local"
                    value={row.dateFin}
                    onChange={(event) =>
                      updateIndispoRow(row.uid, { dateFin: event.target.value })
                    }
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
                  Motif (facultatif)
                </span>
                <textarea
                  value={row.motif}
                  maxLength={255}
                  rows={2}
                  placeholder="Ex. : congrès de cardiologie"
                  onChange={(event) =>
                    updateIndispoRow(row.uid, { motif: event.target.value })
                  }
                  className="w-full rounded-lg border border-medos-line bg-white px-3 py-2.5 text-sm text-medos-ink placeholder:text-medos-slate/60 focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40"
                />
              </label>
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-lg bg-sky-50 px-3 py-2.5 text-xs leading-relaxed text-sky-800">
        Tout est enregistré en une seule fois : horaires et absences sont
        vérifiés (chevauchements refusés) puis ajoutés au planning.
      </p>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" disabled={submitting}>
          Enregistrer le planning
        </Button>
      </div>
    </form>
  );
}

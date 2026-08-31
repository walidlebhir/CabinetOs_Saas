"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  Loader2,
  Phone,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import {
  createRendezvousPatient,
  getCreneauxDuMedecin,
  getMedecinProfil,
} from "@/modules/rendezvous/service/rendezvous.api";
import type {
  Creneau,
  MedecinProfilDetail,
  RendezvousCreatePayload,
} from "@/modules/rendezvous/schema/types";
import { WEEK_DAYS, type WeekDay } from "@/modules/admin/schema/types";

const DAY_LABEL: Record<WeekDay, string> = {
  LUNDI: "Lundi",
  MARDI: "Mardi",
  MERCREDI: "Mercredi",
  JEUDI: "Jeudi",
  VENDREDI: "Vendredi",
  SAMEDI: "Samedi",
  DIMANCHE: "Dimanche",
};

function formatHeure(value: string | null): string {
  if (!value) return "—";
  const [h, m] = value.split(":");
  return `${h}:${m ?? "00"}`;
}

function todayISO(): string {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export function MedecinProfil({ medecinId, cabinetId }: { medecinId: string; cabinetId?: string }) {
  const [profil, setProfil] = useState<MedecinProfilDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState<string>(todayISO());
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [loadingCreneaux, setLoadingCreneaux] = useState(true);

  const [selected, setSelected] = useState<Creneau | null>(null);
  const [motif, setMotif] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMedecinProfil(medecinId)
      .then((data) => {
        if (!cancelled) setProfil(data);
      })
      .catch((cause) => {
        if (!cancelled) {
          setError(extractApiErrorMessage(cause, "Impossible de charger ce médecin."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [medecinId]);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    getCreneauxDuMedecin(medecinId, date)
      .then((data) => {
        if (!cancelled) {
          setCreneaux(data);
          setSelected(null);
          setLoadingCreneaux(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCreneaux([]);
          setSelected(null);
          setLoadingCreneaux(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [date, medecinId]);

  const libres = useMemo(() => creneaux.filter((c) => c.libre), [creneaux]);

  async function prendreRdv() {
    if (!selected || !profil) return;
    setSubmitting(true);
    const payload: RendezvousCreatePayload = {
      id_medecin: profil.id,
      date_rendezvous: date,
      heur_debut: selected.heureDebut,
      heur_fin: selected.heureFin,
      motif: motif.trim() || undefined,
    };
    try {
      await createRendezvousPatient(payload);
      toast.success("Rendez-vous pris avec succès !");
      setMotif("");
      const data = await getCreneauxDuMedecin(medecinId, date);
      setCreneaux(data);
      setSelected(null);
    } catch (cause) {
      toast.error(
        extractApiErrorMessage(cause, "Impossible de prendre ce rendez-vous.")
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-white py-24">
        <Loader2 className="h-6 w-6 animate-spin text-medos-teal" />
      </div>
    );
  }

  if (error || !profil) {
    return (
      <div className="rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
        <Stethoscope className="mx-auto h-8 w-8 text-medos-slate" />
        <p className="mt-3 text-sm font-medium text-medos-navy">
          {error ?? "Médecin introuvable."}
        </p>
        <Button href="/espace-patient/cabinets" variant="secondary" className="mt-5">
          <ArrowLeft className="h-4 w-4" />
          Retour aux cabinets
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        href={
          cabinetId
            ? `/espace-patient/cabinets/${cabinetId}`
            : "/espace-patient/cabinets"
        }
        variant="secondary"
        size="sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au cabinet
      </Button>

      <header className="rounded-2xl border border-medos-line bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-medos-navy text-lg font-bold text-white">
              {profil.prenom?.[0]}
              {profil.nom?.[0]}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-medos-navy">
                Dr. {profil.prenom} {profil.nom}
              </h1>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-medos-teal-dark">
                <BadgeCheck className="h-4 w-4" />
                {profil.specialite}
              </p>
            </div>
          </div>
        </div>

        <dl className="mt-6 grid gap-x-8 gap-y-2 border-t border-medos-line pt-5 text-sm text-medos-slate sm:grid-cols-2">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-medos-teal" />
            N° d&apos;ordre : {profil.numeroOrder}
          </div>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-medos-teal" />
            {profil.anneesExperience} an(s) d&apos;expérience
          </div>
          {profil.teliphone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-medos-teal" />
              {profil.teliphone}
            </div>
          )}
        </dl>

        {profil.biographie && (
          <p className="mt-4 border-t border-medos-line/60 pt-4 text-sm leading-relaxed text-medos-slate">
            {profil.biographie}
          </p>
        )}
      </header>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-medos-line bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="flex items-center gap-2 text-lg font-bold text-medos-navy">
            <CalendarDays className="h-5 w-5 text-medos-teal" />
            Semaine type
          </h2>
          <div className="mt-4 space-y-2.5">
            {WEEK_DAYS.map((jour) => {
              const dispo = profil.disponibilites.find(
                (d) => d.joursemaine === jour && d.actif
              );
              return (
                <div
                  key={jour}
                  className="flex items-center justify-between rounded-lg border border-medos-line/60 bg-medos-frost/40 px-3.5 py-2.5 text-sm"
                >
                  <span className="font-semibold text-medos-navy">
                    {DAY_LABEL[jour]}
                  </span>
                  <span className="text-xs font-medium text-medos-slate">
                    {dispo
                      ? `${formatHeure(dispo.heurDebut)} – ${formatHeure(dispo.heurFin)}`
                      : "Fermé"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-medos-line bg-white p-6 shadow-sm lg:col-span-3">
          <h2 className="text-lg font-bold text-medos-navy">Prendre rendez-vous</h2>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-medos-slate">
              Date du rendez-vous
            </label>
            <Input
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-medos-slate">
              Créneaux ({libres.length} libres)
            </p>
            {loadingCreneaux ? (
              <div className="flex items-center gap-2 py-6 text-sm text-medos-slate">
                <Loader2 className="h-4 w-4 animate-spin text-medos-teal" />
                Chargement de l&apos;agenda…
              </div>
            ) : creneaux.length === 0 ? (
              <div className="rounded-lg border border-dashed border-medos-line bg-medos-frost/30 px-4 py-8 text-center text-sm text-medos-slate">
                Aucun créneau pour ce jour. Le médecin est peut-être indisponible.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {creneaux.map((c) => {
                  const active = selected?.heureDebut === c.heureDebut;
                  return (
                    <button
                      key={c.heureDebut}
                      type="button"
                      disabled={!c.libre}
                      onClick={() => setSelected(active ? null : c)}
                      className={
                        c.libre
                          ? `rounded-lg border px-2 py-2.5 text-xs font-semibold transition-colors ${
                              active
                                ? "border-medos-teal bg-medos-teal text-white"
                                : "border-medos-line bg-white text-medos-navy hover:border-medos-teal/50 hover:bg-medos-frost"
                            }`
                          : "cursor-not-allowed rounded-lg border border-medos-line/60 bg-slate-50 px-2 py-2.5 text-xs font-medium text-slate-300 line-through"
                      }
                    >
                      {formatHeure(c.heureDebut)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selected && (
            <div className="mt-4 space-y-3 rounded-xl border border-medos-teal/30 bg-medos-frost/50 p-4">
              <p className="text-sm text-medos-navy">
                Créneau choisi :{" "}
                <span className="font-bold">
                  {formatHeure(selected.heureDebut)} – {formatHeure(selected.heureFin)}
                </span>
              </p>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-medos-slate">
                Motif (optionnel)
              </label>
              <Input
                value={motif}
                placeholder="Motif de la consultation"
                onChange={(e) => setMotif(e.target.value)}
              />
              <Button onClick={prendreRdv} disabled={submitting} className="w-full">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirmer le rendez-vous
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

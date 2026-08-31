"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  ArrowLeft,
  Building2,
  Stethoscope,
  GraduationCap,
  Phone,
  BadgeCheck,
} from "lucide-react";
import { getCabinetDetail } from "@/modules/home/service/cabinet.api";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import type { CabinetDetail } from "@/modules/home/schema/types";

export default function CabinetDetailPage() {
  const params = useParams<{ cabinetId: string }>();
  const [cabinet, setCabinet] = useState<CabinetDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cabinetId = params?.cabinetId;
    if (!cabinetId) return;
    let cancelled = false;
    getCabinetDetail(cabinetId)
      .then((data) => {
        if (!cancelled) setCabinet(data);
      })
      .catch((cause) => {
        if (!cancelled) {
          setError(
            extractApiErrorMessage(cause, "Impossible de charger ce cabinet.")
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-white" />
        <div className="h-48 animate-pulse rounded-2xl bg-white" />
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (error || !cabinet) {
    return (
      <div className="rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
        <Building2 className="mx-auto h-8 w-8 text-medos-slate" />
        <p className="mt-3 text-sm font-medium text-medos-navy">
          {error ?? "Cabinet introuvable."}
        </p>
        <Link
          href="/espace-patient/cabinets"
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-medos-line bg-white px-4 text-sm font-medium text-medos-navy transition-colors hover:border-medos-teal/40 hover:bg-medos-frost"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux cabinets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/espace-patient/cabinets"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-medos-slate transition-colors hover:text-medos-teal-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux cabinets
      </Link>

      <header className="rounded-2xl border border-medos-line bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-medos-frost">
              <Building2 className="h-6 w-6 text-medos-teal" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-medos-navy">
                {cabinet.nom}
              </h1>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-medos-teal-dark">
                <Stethoscope className="h-4 w-4" />
                {cabinet.specialite}
              </p>
            </div>
          </div>
          <span
            className={
              cabinet.status === "ACTIF"
                ? "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                : "inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500"
            }
          >
            {cabinet.status}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-medos-line pt-5 text-sm text-medos-slate">
          {cabinet.ville && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-medos-teal" />
              {cabinet.ville}
              {cabinet.localisation ? ` — ${cabinet.localisation}` : ""}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Stethoscope className="h-4 w-4 text-medos-teal" />
            {cabinet.medecins.length}{" "}
            {cabinet.medecins.length > 1 ? "médecins" : "médecin"}
          </span>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-medos-navy">Équipe médicale</h2>

        {cabinet.medecins.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-medos-line bg-white px-6 py-12 text-center">
            <Stethoscope className="mx-auto h-7 w-7 text-medos-slate" />
            <p className="mt-3 text-sm text-medos-slate">
              Aucun médecin enregistré dans ce cabinet pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cabinet.medecins.map((medecin) => (
              <article
                key={medecin.id}
                className="flex flex-col rounded-2xl border border-medos-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-medos-navy text-xs font-bold text-white">
                    {medecin.prenom?.[0]}
                    {medecin.nom?.[0]}
                  </span>
                  <div className="min-w-0 leading-tight">
                    <Link
                      href={`/espace-patient/cabinets/${cabinet.id}/medecins/${medecin.id}`}
                      className="truncate text-base font-bold text-medos-navy transition-colors hover:text-medos-teal-dark"
                    >
                      <span className="block truncate">
                        Dr. {medecin.prenom} {medecin.nom}
                      </span>
                    </Link>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-medos-teal-dark">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {medecin.specialite}
                    </p>
                  </div>
                </div>

                <dl className="mt-4 space-y-2 text-xs text-medos-slate">
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Numéro d&apos;ordre</dt>
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    <dd>N° d&apos;ordre : {medecin.numeroOrder}</dd>
                  </div>
                  {medecin.teliphone && (
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Téléphone</dt>
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <dd>{medecin.teliphone}</dd>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Expérience</dt>
                    <GraduationCap className="h-3.5 w-3.5 shrink-0 opacity-0" />
                    <dd>{medecin.anneesExperience} an(s) d&apos;expérience</dd>
                  </div>
                </dl>

                {medecin.biographie && (
                  <p className="mt-3 line-clamp-3 border-t border-medos-line/60 pt-3 text-xs leading-relaxed text-medos-slate">
                    {medecin.biographie}
                  </p>
                )}

                <Link
                  href={`/espace-patient/cabinets/${cabinet.id}/medecins/${medecin.id}`}
                  className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-medos-teal px-4 text-sm font-medium text-white transition-colors hover:bg-medos-teal-dark"
                >
                  Voir le profil & prendre rendez-vous
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

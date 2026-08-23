"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Stethoscope,
  Users,
  Building2,
  ArrowRight,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import { getCabinets } from "@/modules/home/service/cabinet.api";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import type { CabinetHome } from "@/modules/home/schema/types";

type LoadPhase = "loading" | "ready" | "refreshing";

export function CabinetsCatalog({ limit }: { limit?: number }) {
  const [cabinets, setCabinets] = useState<CabinetHome[]>([]);
  const [phase, setPhase] = useState<LoadPhase>("loading");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCabinets()
      .then((data) => {
        if (!cancelled) setCabinets(data);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setPhase("ready");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRefresh = async () => {
    setPhase("refreshing");
    try {
      const data = await getCabinets();
      setCabinets(data);
      setHasError(false);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible de charger la liste des cabinets."
        )
      );
    } finally {
      setPhase("ready");
    }
  };

  const visibleCabinets =
    typeof limit === "number" ? cabinets.slice(0, limit) : cabinets;

  if (phase === "loading") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-2xl border border-medos-line bg-white"
          />
        ))}
      </div>
    );
  }

  if (cabinets.length === 0 || hasError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
          <Building2 className="h-5 w-5 text-medos-teal" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-medos-navy">
          {hasError
            ? "Erreur de chargement des cabinets"
            : "Aucun cabinet disponible"}
        </h3>
        <p className="mt-1.5 max-w-md text-sm text-medos-slate">
          {hasError
            ? "Vérifiez que le backend est démarré puis réessayez."
            : "Les cabinets médicaux inscrits sur MedOS apparaîtront ici."}
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={phase === "refreshing"}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border border-medos-line bg-white px-4 text-sm font-medium text-medos-navy transition-colors hover:border-medos-teal/40 hover:bg-medos-frost disabled:opacity-50"
        >
          <RotateCw
            className={phase === "refreshing" ? "h-4 w-4 animate-spin" : "h-4 w-4"}
          />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleCabinets.map((cabinet) => (
          <Link
            key={cabinet.id}
            href={`/espace-patient/cabinets/${cabinet.id}`}
            className="group flex h-full flex-col rounded-2xl border border-medos-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-medos-frost transition-colors group-hover:bg-medos-teal">
                <Building2 className="h-5 w-5 text-medos-teal transition-colors group-hover:text-white" />
              </span>
              <span
                className={
                  cabinet.status === "ACTIF"
                    ? "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                    : "inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500"
                }
              >
                {cabinet.status}
              </span>
            </div>

            <h3 className="mt-4 text-base font-bold text-medos-navy">
              {cabinet.nom}
            </h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-medos-teal-dark">
              <Stethoscope className="h-3.5 w-3.5" />
              {cabinet.specialite}
            </p>

            <div className="mt-auto space-y-1.5 pt-4 text-xs text-medos-slate">
              {cabinet.ville && (
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {cabinet.ville}
                  {cabinet.localisation ? ` — ${cabinet.localisation}` : ""}
                </p>
              )}
              <p className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 shrink-0" />
                {cabinet.nombreMedecins}{" "}
                {cabinet.nombreMedecins > 1 ? "médecins" : "médecin"}
              </p>
            </div>

            <span className="mt-4 inline-flex items-center gap-1 border-t border-medos-line/60 pt-3 text-sm font-medium text-medos-teal transition-colors group-hover:text-medos-teal-dark">
              Voir les médecins
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      {phase === "refreshing" && (
        <p className="text-center text-xs text-medos-slate">Actualisation…</p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  Building2,
  CalendarRange,
  Mail,
  Phone,
  RotateCw,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMyProfile } from "@/modules/admin/service/medecin.api";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import type { Medecin } from "@/modules/admin/schema/types";

type Phase = "loading" | "ready" | "refreshing";

function initials(medecin: Medecin): string {
  const first = medecin.prenom?.trim()?.[0] ?? "";
  const last = medecin.nom?.trim()?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "DR";
}

export function MonProfilMedecin() {
  const [medecin, setMedecin] = useState<Medecin | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      getMyProfile()
        .then((data) => {
          if (!cancelled) {
            setMedecin(data);
            setHasError(false);
          }
        })
        .catch((error) => {
          if (!cancelled) {
            setHasError(true);
            toast.error(
              extractApiErrorMessage(
                error,
                "Impossible de charger votre profil."
              )
            );
          }
        })
        .finally(() => {
          if (!cancelled) setPhase("ready");
        });
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRefresh = () => {
    setPhase("refreshing");
    const reload = async () => {
      try {
        const data = await getMyProfile();
        setMedecin(data);
        setHasError(false);
      } catch (error) {
        toast.error(
          extractApiErrorMessage(error, "Impossible de charger votre profil.")
        );
      } finally {
        setPhase("ready");
      }
    };
    void reload();
  };

  if (phase === "loading") {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-medos-line/60" />
        <div className="h-64 animate-pulse rounded-2xl border border-medos-line bg-white" />
      </div>
    );
  }

  if (!medecin || hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-medos-navy">
            Mon profil
          </h1>
          <p className="mt-1 text-sm text-medos-slate">
            Vos informations professionnelles en tant que médecin.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
            <UserRound className="h-5 w-5 text-medos-teal" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-medos-navy">
            Impossible de charger votre profil
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-medos-slate">
            Votre compte n&apos;est peut-être relié à aucun profil médecin, ou
            le backend est indisponible. Réessayez.
          </p>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={phase === "refreshing"}
            className="mt-5"
          >
            <RotateCw
              className={
                phase === "refreshing" ? "h-4 w-4 animate-spin" : "h-4 w-4"
              }
            />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const infoItems: { icon: typeof Mail; label: string; value: string }[] = [
    {
      icon: Stethoscope,
      label: "Spécialité",
      value: medecin.specialite || "Non renseignée",
    },
    {
      icon: Award,
      label: "Numéro d'ordre",
      value: medecin.numeroOrder || "Non renseigné",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: medecin.teliphone || "Non renseigné",
    },
    {
      icon: Mail,
      label: "Email",
      value: medecin.email ?? "Non renseigné",
    },
    {
      icon: BriefcaseBusiness,
      label: "Années d'expérience",
      value: `${medecin.anneesExperience} an${medecin.anneesExperience > 1 ? "s" : ""}`,
    },
    {
      icon: Building2,
      label: "Cabinet",
      value: medecin.cabinetNom ?? "Non rattaché",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-medos-navy">
          Mon profil
        </h1>
        <p className="mt-1 text-sm text-medos-slate">
          Vos informations professionnelles en tant que médecin.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-medos-line bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-4 bg-gradient-to-r from-medos-frost to-white p-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-medos-teal text-lg font-bold text-white shadow-sm">
            {initials(medecin)}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold text-medos-navy">
              Dr {medecin.prenom} {medecin.nom}
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-medos-slate">
              <Stethoscope className="h-4 w-4 text-medos-teal" />
              {medecin.specialite || "Spécialité non renseignée"}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={phase === "refreshing"}
          >
            <RotateCw
              className={
                phase === "refreshing" ? "h-4 w-4 animate-spin" : "h-4 w-4"
              }
            />
            Actualiser
          </Button>
        </div>

        <dl className="grid gap-px border-t border-medos-line bg-medos-line sm:grid-cols-2 lg:grid-cols-3">
          {infoItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white p-5">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-medos-slate">
                <Icon className="h-4 w-4 text-medos-teal" />
                {label}
              </dt>
              <dd className="mt-1.5 break-words text-sm font-medium text-medos-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-2xl border border-medos-line bg-white p-5 shadow-sm sm:p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-medos-navy">
          <CalendarRange className="h-4 w-4 text-medos-teal" />
          Biographie
        </h3>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-medos-ink">
          {medecin.biographie?.trim()
            ? medecin.biographie
            : "Aucune biographie renseignée pour le moment."}
        </p>
      </div>

      <div className="rounded-2xl border border-medos-line bg-white p-5 shadow-sm sm:p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-medos-navy">
          <ShieldCheck className="h-4 w-4 text-medos-teal" />
          Compte
        </h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
              Identifiant
            </p>
            <p className="mt-1 break-words text-sm font-medium text-medos-ink">
              {medecin.email ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-medos-slate">
              Statut
            </p>
            <span
              className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                medecin.accountActive === false
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {medecin.hasAccount
                ? medecin.accountActive === false
                  ? "Compte désactivé"
                  : "Compte actif"
                : "Aucun compte lié"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

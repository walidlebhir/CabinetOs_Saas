"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  RotateCw,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMyProfile } from "@/modules/admin/service/secretaire.api";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import type { Secretaire } from "@/modules/admin/schema/types";

type Phase = "loading" | "ready" | "refreshing";

function initials(secretaire: Secretaire): string {
  const first = secretaire.prenom?.trim()?.[0] ?? "";
  const last = secretaire.nom?.trim()?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "SE";
}

export function MonProfilSecretaire() {
  const [secretaire, setSecretaire] = useState<Secretaire | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      getMyProfile()
        .then((data) => {
          if (!cancelled) {
            setSecretaire(data);
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
        setSecretaire(data);
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

  if (!secretaire || hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-medos-navy">
            Mon profil
          </h1>
          <p className="mt-1 text-sm text-medos-slate">
            Vos informations en tant que secrétaire du cabinet.
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
            Votre compte n&apos;est peut-être relié à aucun profil secrétaire,
            ou le backend est indisponible. Réessayez.
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-medos-navy">
          Mon profil
        </h1>
        <p className="mt-1 text-sm text-medos-slate">
          Vos informations en tant que secrétaire du cabinet.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-medos-line bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-4 bg-gradient-to-r from-medos-frost to-white p-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-medos-teal text-lg font-bold text-white shadow-sm">
            {initials(secretaire)}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold text-medos-navy">
              {secretaire.prenom} {secretaire.nom}
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-medos-slate">
              <BadgeCheck className="h-4 w-4 text-medos-teal" />
              Secrétaire médicale
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
          <div className="bg-white p-5">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-medos-slate">
              <Phone className="h-4 w-4 text-medos-teal" />
              Téléphone
            </dt>
            <dd className="mt-1.5 break-words text-sm font-medium text-medos-ink">
              {secretaire.teliphone ?? "Non renseigné"}
            </dd>
          </div>
          <div className="bg-white p-5">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-medos-slate">
              <Mail className="h-4 w-4 text-medos-teal" />
              Email du compte
            </dt>
            <dd className="mt-1.5 break-words text-sm font-medium text-medos-ink">
              {secretaire.email ?? "Aucun compte lié"}
            </dd>
          </div>
          <div className="bg-white p-5">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-medos-slate">
              <CalendarDays className="h-4 w-4 text-medos-teal" />
              Date d&apos;embauche
            </dt>
            <dd className="mt-1.5 break-words text-sm font-medium text-medos-ink">
              {secretaire.dateEmbauche
                ? new Intl.DateTimeFormat("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(secretaire.dateEmbauche))
                : "Non renseignée"}
            </dd>
          </div>
          <div className="bg-white p-5 sm:col-span-2">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-medos-slate">
              <MapPin className="h-4 w-4 text-medos-teal" />
              Adresse
            </dt>
            <dd className="mt-1.5 break-words text-sm font-medium text-medos-ink">
              {secretaire.adress ?? "Non renseignée"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-medos-line bg-white p-5 shadow-sm sm:p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-medos-navy">
          <Building2 className="h-4 w-4 text-medos-teal" />
          Compte
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-medos-slate">
          <BriefcaseBusiness className="mr-1.5 inline h-4 w-4 text-medos-teal" />
          Votre compte d&apos;accès a été créé par l&apos;administrateur du
          cabinet. Pour toute modification de vos informations personnelles,
          contactez l&apos;administration.
        </p>
      </div>
    </div>
  );
}

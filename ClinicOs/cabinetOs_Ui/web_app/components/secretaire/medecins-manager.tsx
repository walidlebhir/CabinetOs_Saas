"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BadgeCheck,
  Building2,
  RotateCw,
  ShieldOff,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import {
  activateMedecinAccount,
  deactivateMedecinAccount,
  getMedecinsDeMonCabinet,
} from "@/modules/secretaire/service/medecin.api";
import type { Medecin } from "@/modules/admin/schema/types";

type LoadPhase = "loading" | "ready" | "refreshing";

type ToggleTarget = {
  medecin: Medecin;
  nextActive: boolean;
};

function fullName(medecin: Medecin): string {
  return `Dr ${medecin.prenom} ${medecin.nom}`;
}

function AccountStatusBadge({ medecin }: { medecin: Medecin }) {
  if (!medecin.hasAccount) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
        Aucun compte
      </span>
    );
  }
  if (medecin.accountActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <BadgeCheck className="h-3.5 w-3.5" />
        Actif
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
      <ShieldOff className="h-3.5 w-3.5" />
      Désactivé
    </span>
  );
}

export function MedecinsManagerSecretaire() {
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [phase, setPhase] = useState<LoadPhase>("loading");
  const [hasError, setHasError] = useState(false);
  const [cabinetNom, setCabinetNom] = useState<string | null>(null);
  const [toggleTarget, setToggleTarget] = useState<ToggleTarget | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMedecinsDeMonCabinet()
      .then((data) => {
        if (!cancelled) {
          setMedecins(data);
          setCabinetNom(data[0]?.cabinetNom ?? null);
          setHasError(false);
          setPhase("ready");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setHasError(true);
          setPhase("ready");
          toast.error(
            extractApiErrorMessage(
              error,
              "Impossible de charger les médecins de votre cabinet."
            )
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const reloadMedecins = useCallback(async () => {
    setPhase("refreshing");
    try {
      const data = await getMedecinsDeMonCabinet();
      setMedecins(data);
      setCabinetNom(data[0]?.cabinetNom ?? null);
      setHasError(false);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          "Impossible de charger les médecins de votre cabinet."
        )
      );
    } finally {
      setPhase("ready");
    }
  }, []);

  const requestToggleAccount = useCallback((medecin: Medecin) => {
    if (!medecin.hasAccount) return;
    setToggleTarget({
      medecin,
      nextActive: !medecin.accountActive,
    });
  }, []);

  const handleToggleConfirm = async () => {
    const target = toggleTarget;
    if (!target) return;
    const { medecin, nextActive } = target;

    setIsToggling(true);
    try {
      if (nextActive) {
        await activateMedecinAccount(medecin.id);
      } else {
        await deactivateMedecinAccount(medecin.id);
      }
      toast.success(
        nextActive
          ? `Compte de ${fullName(medecin)} activé.`
          : `Compte de ${fullName(medecin)} désactivé.`
      );
      setToggleTarget(null);
      await reloadMedecins();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(
          error,
          nextActive
            ? "Impossible d'activer le compte de ce médecin."
            : "Impossible de désactiver le compte de ce médecin."
        )
      );
      await reloadMedecins();
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
            {cabinetNom
              ? `Cabinet : ${cabinetNom}`
              : "Comptes des médecins"}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
            Médecins
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-medos-slate">
            Consultez les médecins du cabinet et activez ou désactivez leur
            compte d&apos;accès à l&apos;espace médecin.
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => void reloadMedecins()}
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

      {phase === "loading" ? (
        <div className="h-64 animate-pulse rounded-2xl border border-medos-line bg-white" />
      ) : hasError && medecins.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
            <Building2 className="h-5 w-5 text-medos-teal" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-medos-navy">
            Impossible de charger les médecins
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-medos-slate">
            Votre profil ne semble relié à aucun cabinet, ou le backend est
            indisponible. Réessayez.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-5"
            onClick={() => void reloadMedecins()}
            disabled={phase === "refreshing"}
          >
            Réessayer
          </Button>
        </div>
      ) : medecins.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
            <Stethoscope className="h-5 w-5 text-medos-teal" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-medos-navy">
            Aucun médecin dans votre cabinet
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-medos-slate">
            Les médecins ajoutés par l&apos;administration de votre cabinet
            apparaîtront ici.
          </p>
        </div>
      ) : (
        <section className="rounded-2xl border border-medos-line bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-medos-line px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-medos-navy">
                Liste des médecins
              </h2>
              <p className="text-xs text-medos-slate">
                {medecins.length}{" "}
                {medecins.length > 1
                  ? "médecins enregistrés"
                  : "médecin enregistré"}
              </p>
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-medos-line bg-medos-mist/60 text-xs uppercase tracking-wide text-medos-slate">
                  <th className="px-5 py-3 font-semibold">Médecin</th>
                  <th className="px-5 py-3 font-semibold">Spécialité</th>
                  <th className="px-5 py-3 font-semibold">N° d&apos;ordre</th>
                  <th className="px-5 py-3 font-semibold">Email du compte</th>
                  <th className="px-5 py-3 font-semibold">Statut</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {medecins.map((medecin) => (
                  <tr
                    key={medecin.id}
                    className="border-b border-medos-line/60 last:border-0 transition-colors hover:bg-medos-frost/50"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-medos-frost text-xs font-bold text-medos-teal-dark">
                          {`${medecin.prenom.charAt(0)}${medecin.nom.charAt(0)}`.toUpperCase()}
                        </span>
                        <span className="font-semibold text-medos-navy">
                          {fullName(medecin)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-medos-slate">
                      {medecin.specialite}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-medos-ink">
                      {medecin.numeroOrder}
                    </td>
                    <td className="px-5 py-3.5 text-medos-slate">
                      {medecin.email ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <AccountStatusBadge medecin={medecin} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {medecin.hasAccount ? (
                        <span className="inline-flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={
                              medecin.accountActive ? "secondary" : "primary"
                            }
                            onClick={() => requestToggleAccount(medecin)}
                          >
                            {medecin.accountActive ? "Désactiver" : "Activer"}
                          </Button>
                        </span>
                      ) : (
                        <span className="text-xs text-medos-slate">
                          Aucun compte à gérer
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <ConfirmDialog
        open={toggleTarget !== null}
        onClose={isToggling ? () => {} : () => setToggleTarget(null)}
        onConfirm={() => void handleToggleConfirm()}
        tone={toggleTarget?.nextActive ? "primary" : "danger"}
        title={
          toggleTarget?.nextActive
            ? "Activer le compte ?"
            : "Désactiver le compte ?"
        }
        description={
          toggleTarget ? (
            toggleTarget.nextActive ? (
              <>
                Voulez-vous activer le compte de{" "}
                <span className="font-semibold text-medos-navy">
                  {fullName(toggleTarget.medecin)}
                </span>{" "}
                ?
                <br />
                Le médecin pourra à nouveau se connecter à son espace avec ses
                identifiants.
              </>
            ) : (
              <>
                Voulez-vous vraiment désactiver le compte de{" "}
                <span className="font-semibold text-medos-navy">
                  {fullName(toggleTarget.medecin)}
                </span>{" "}
                ?
                <br />
                Le médecin ne pourra plus se connecter à son espace.
              </>
            )
          ) : undefined
        }
        confirmLabel={
          isToggling
            ? "Traitement…"
            : toggleTarget?.nextActive
              ? "Activer"
              : "Désactiver"
        }
        isPending={isToggling}
      />
    </div>
  );
}
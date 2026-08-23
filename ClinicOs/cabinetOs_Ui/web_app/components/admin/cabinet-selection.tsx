"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Loader2,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMyCabinets } from "@/modules/cabinet/service/cabinet.api";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import {
  decodeJwtPayload,
  getAccessToken,
} from "@/lib/auth-storage";
import { saveSelectedCabinet } from "@/lib/cabinet-storage";
import type { AdminCabinet } from "@/modules/cabinet/schema/types";

type Phase = "loading" | "ready" | "refreshing";

export function CabinetSelection() {
  const router = useRouter();
  const [cabinets, setCabinets] = useState<AdminCabinet[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [hasError, setHasError] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const role = decodeJwtPayload(token)?.role;
    if (role !== "ADMIN") {
      router.replace(role ? "/espace-patient" : "/login");
      return;
    }
    getMyCabinets()
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
  }, [router]);

  useEffect(() => {
    if (phase !== "ready" || hasError) return;
    if (cabinets.length === 0) {
      toast.info(
        "Aucun cabinet n'est encore configuré. Commençons par le créer."
      );
      router.replace("/admin-cabinet/parametres");
    }
  }, [phase, hasError, cabinets.length, router]);

  const handleRefresh = async () => {
    setPhase("refreshing");
    try {
      const data = await getMyCabinets();
      setCabinets(data);
      setHasError(false);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "Impossible de charger vos cabinets.")
      );
    } finally {
      setPhase("ready");
    }
  };

  const handleSelect = async (cabinet: AdminCabinet) => {
    setSelectingId(cabinet.id);
    saveSelectedCabinet({
      id: cabinet.id,
      nom: cabinet.nom,
      status: cabinet.status,
    });
    await Promise.resolve();
    router.push("/admin-cabinet");
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
            <Building2 className="h-5 w-5 text-medos-teal" />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-medos-navy">
            Choisir un cabinet
          </h1>
          <p className="mt-2 text-sm text-medos-slate">
            Sélectionnez le cabinet dans lequel vous souhaitez travailler.
          </p>
        </div>

        {phase === "loading" ? (
          <div className="mt-8 space-y-3">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl border border-medos-line bg-white"
              />
            ))}
          </div>
        ) : hasError ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-10 text-center">
            <h2 className="text-base font-bold text-medos-navy">
              Impossible de charger vos cabinets
            </h2>
            <p className="mt-1.5 text-sm text-medos-slate">
              Vérifiez que le backend est démarré puis réessayez.
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
        ) : (
          <ul className="mt-8 list-none space-y-3">
            {cabinets.map((cabinet) => (
              <li key={cabinet.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(cabinet)}
                  disabled={selectingId !== null}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-medos-line bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5 disabled:pointer-events-none disabled:opacity-60"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-medos-frost transition-colors group-hover:bg-medos-teal">
                    <Building2 className="h-5 w-5 text-medos-teal transition-colors group-hover:text-white" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-medos-navy">
                      {cabinet.nom}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-xs text-medos-slate">
                      <span>{cabinet.specialite}</span>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={
                            cabinet.status === "ACTIF"
                              ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                              : "h-1.5 w-1.5 rounded-full bg-slate-400"
                          }
                        />
                        {cabinet.status === "ACTIF" ? "Actif" : "Inactif"}
                      </span>
                    </span>
                  </span>

                  {selectingId === cabinet.id ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-medos-teal" />
                  ) : (
                    <ArrowRight className="h-4 w-4 shrink-0 text-medos-slate transition-all group-hover:translate-x-0.5 group-hover:text-medos-teal" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

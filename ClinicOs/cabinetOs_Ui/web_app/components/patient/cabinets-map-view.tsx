"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Building2,
  MapPin,
  RotateCw,
  Search,
  SearchX,
} from "lucide-react";
import { toast } from "sonner";
import { getCabinets } from "@/modules/home/service/cabinet.api";
import { extractApiErrorMessage } from "@/modules/auth/service/api-error";
import type { CabinetHome } from "@/modules/home/schema/types";

const CabinetsMap = dynamic(() => import("./cabinets-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[420px] w-full animate-pulse bg-medos-frost sm:min-h-[500px] lg:min-h-0" />
  ),
});

type LoadPhase = "loading" | "ready" | "refreshing";

function hasCoordinates(
  cabinet: CabinetHome
): cabinet is CabinetHome & { latitude: number; longitude: number } {
  return (
    cabinet.latitude !== null &&
    cabinet.latitude !== undefined &&
    cabinet.longitude !== null &&
    cabinet.longitude !== undefined
  );
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function cabinetHaystack(cabinet: CabinetHome): string {
  return normalizeText(
    [
      cabinet.nom,
      cabinet.specialite,
      cabinet.ville ?? "",
      cabinet.localisation ?? "",
    ].join(" ")
  );
}

export function CabinetsMapView() {
  const [cabinets, setCabinets] = useState<CabinetHome[]>([]);
  const [phase, setPhase] = useState<LoadPhase>("loading");
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const normalizedQuery = normalizeText(query.trim());

  const filteredCabinets = useMemo(() => {
    if (normalizedQuery === "") return cabinets;
    return cabinets.filter((cabinet) =>
      cabinetHaystack(cabinet).includes(normalizedQuery)
    );
  }, [cabinets, normalizedQuery]);

  const locatedCount = useMemo(
    () => filteredCabinets.filter(hasCoordinates).length,
    [filteredCabinets]
  );

  const locatedPoints = useMemo(
    () => cabinets.filter(hasCoordinates),
    [cabinets]
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    const nextNormalizedQuery = normalizeText(value.trim());
    if (nextNormalizedQuery === "") {
      setSelectedId(null);
      return;
    }
    const found = cabinets.filter((cabinet) =>
      cabinetHaystack(cabinet).includes(nextNormalizedQuery)
    );
    const firstLocated = found.find(hasCoordinates);
    setSelectedId(firstLocated ? firstLocated.id : null);
  };

  const handleSelectCabinet = (cabinet: CabinetHome) => {
    if (!hasCoordinates(cabinet)) return;
    setSelectedId(cabinet.id);
  };

  if (phase === "loading") {
    return (
      <div className="cabinets-map-layout h-full">
        <div
          style={{ gridArea: "search" }}
          className="h-36 animate-pulse rounded-2xl border border-medos-line bg-white"
        />
        <div
          style={{ gridArea: "map" }}
          className="min-h-[420px] animate-pulse rounded-2xl border border-medos-line bg-white sm:min-h-[500px] lg:min-h-0"
        />
        <div
          style={{ gridArea: "list" }}
          className="h-72 animate-pulse rounded-2xl border border-medos-line bg-white"
        />
      </div>
    );
  }

  if (hasError && cabinets.length === 0) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
          <MapPin className="h-5 w-5 text-medos-teal" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-medos-navy">
          Erreur de chargement de la carte
        </h3>
        <p className="mt-1.5 max-w-md text-sm text-medos-slate">
          Vérifiez que le backend est démarré puis réessayez.
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
    <div className="cabinets-map-layout h-full">
      <section
        aria-label="Recherche de cabinet"
        style={{ gridArea: "search" }}
        className="rounded-2xl border border-medos-line bg-white p-4 shadow-sm sm:p-5"
      >
        <label
          htmlFor="recherche-cabinet-carte"
          className="block text-sm font-semibold text-medos-navy"
        >
          Rechercher un cabinet
        </label>
        <p className="mt-1 text-xs text-medos-slate">
          Par nom, ville ou spécialité.
        </p>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-medos-slate" />
          <input
            id="recherche-cabinet-carte"
            type="text"
            placeholder="Rechercher un cabinet…"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-medos-line bg-white pl-10 pr-10 text-sm text-medos-ink placeholder:text-medos-slate/60 transition-colors focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40"
          />
          {query && (
            <button
              type="button"
              aria-label="Effacer la recherche"
              onClick={() => handleQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-medos-slate transition-colors hover:text-medos-navy"
            >
              ✕
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-medos-slate">
          {locatedCount} sur {filteredCabinets.length}{" "}
          {filteredCabinets.length > 1 ? "cabinets localisés" : "cabinet localisé"}
        </p>
      </section>

      <section
        aria-label="Carte des cabinets"
        style={{ gridArea: "map" }}
        className="relative z-0 min-h-[420px] overflow-hidden rounded-2xl border border-medos-line bg-medos-frost shadow-sm shadow-medos-navy/5 sm:min-h-[520px] lg:min-h-0"
      >
        <CabinetsMap points={locatedPoints} selectedId={selectedId} />
      </section>

      <section
        aria-label="Liste des cabinets"
        style={{ gridArea: "list" }}
        className="flex min-h-0 flex-col rounded-2xl border border-medos-line bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold text-medos-navy">
            {normalizedQuery === ""
              ? "Tous les cabinets"
              : `${filteredCabinets.length} ${
                  filteredCabinets.length > 1 ? "résultats" : "résultat"
                }`}
          </h2>
          <span className="shrink-0 text-xs text-medos-slate">
            {locatedCount}/{cabinets.length} localisés
          </span>
        </div>

        {filteredCabinets.length === 0 ? (
          <p className="mt-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <SearchX className="mt-0.5 h-4 w-4 shrink-0" />
            Aucun cabinet ne correspond à « {query.trim()} ».
          </p>
        ) : cabinets.length === 0 ? (
          <p className="mt-6 text-center text-sm text-medos-slate">
            Aucun cabinet disponible pour le moment.
          </p>
        ) : (
          <ul className="mt-3 max-h-[26rem] min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 lg:max-h-none">
            {filteredCabinets.map((cabinet) => {
              const locatable = hasCoordinates(cabinet);
              const isSelected = selectedId === cabinet.id;
              return (
                <li key={cabinet.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectCabinet(cabinet)}
                    disabled={!locatable}
                    aria-disabled={!locatable}
                    title={
                      locatable
                        ? `Centrer la carte sur ${cabinet.nom}`
                        : "Ce cabinet n'a pas de coordonnées GPS"
                    }
                    className={
                      isSelected
                        ? "w-full rounded-xl border border-medos-teal bg-medos-frost px-3.5 py-3 text-left transition-colors"
                        : locatable
                          ? "w-full rounded-xl border border-medos-line bg-white px-3.5 py-3 text-left transition-colors hover:border-medos-teal/40 hover:bg-medos-frost/60"
                          : "w-full cursor-not-allowed rounded-xl border border-medos-line bg-white px-3.5 py-3 text-left opacity-75 transition-colors"
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-medos-frost">
                          <Building2 className="h-4 w-4 text-medos-teal" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-medos-navy">
                            {cabinet.nom}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-medos-slate">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                              {cabinet.ville ??
                                cabinet.localisation ??
                                "Ville non renseignée"}
                            </span>
                          </p>
                          <p className="mt-0.5 truncate text-xs font-medium text-medos-teal-dark">
                            {cabinet.specialite}
                          </p>
                        </div>
                      </div>
                      <span
                        className={
                          locatable
                            ? "shrink-0 rounded-full border border-medos-line bg-medos-frost px-2 py-0.5 text-[11px] font-medium text-medos-teal-dark"
                            : "shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-400"
                        }
                      >
                        {locatable ? "Localisé" : "Non localisé"}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {phase === "refreshing" && (
          <p className="mt-3 shrink-0 text-center text-xs text-medos-slate">
            Actualisation…
          </p>
        )}
      </section>
    </div>
  );
}

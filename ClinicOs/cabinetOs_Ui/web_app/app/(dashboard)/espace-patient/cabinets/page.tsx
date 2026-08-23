import type { Metadata } from "next";
import { CabinetsCatalog } from "@/components/patient/cabinets-catalog";

export const metadata: Metadata = {
  title: "Cabinets médicaux",
};

export default function CabinetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
          Annuaire
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
          Cabinets médicaux
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-medos-slate">
          Tous les cabinets inscrits sur MedOS : spécialité, ville et équipe
          médicale.
        </p>
      </div>

      <CabinetsCatalog />
    </div>
  );
}

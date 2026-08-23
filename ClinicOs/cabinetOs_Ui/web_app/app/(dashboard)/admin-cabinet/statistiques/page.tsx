import type { Metadata } from "next";
import { SectionPage } from "@/components/dashboard/section-page";

export const metadata: Metadata = {
  title: "Statistiques",
};

export default function StatistiquesPage() {
  return (
    <SectionPage
      eyebrow="Pilotage"
      title="Statistiques & pilotage"
      description="Suivez l'activité du cabinet : fréquentation, recettes, taux d'occupation et performance par praticien."
    />
  );
}

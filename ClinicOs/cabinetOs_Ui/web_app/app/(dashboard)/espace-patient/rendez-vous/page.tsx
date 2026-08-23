import type { Metadata } from "next";
import { SectionPage } from "@/components/dashboard/section-page";

export const metadata: Metadata = {
  title: "Mes rendez-vous",
};

export default function MesRendezVousPage() {
  return (
    <SectionPage
      eyebrow="Santé"
      title="Mes rendez-vous"
      description="Consultez vos prochains rendez-vous, votre historique et le détail de vos visites."
    />
  );
}

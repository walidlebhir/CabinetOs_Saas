import type { Metadata } from "next";
import { SectionPage } from "@/components/dashboard/section-page";

export const metadata: Metadata = {
  title: "Rendez-vous",
};

export default function RendezVousPage() {
  return (
    <SectionPage
      eyebrow="Agenda"
      title="Rendez-vous"
      description="Consultez, planifiez et suivez tous les rendez-vous du cabinet : confirmations, reports et annulations."
    />
  );
}

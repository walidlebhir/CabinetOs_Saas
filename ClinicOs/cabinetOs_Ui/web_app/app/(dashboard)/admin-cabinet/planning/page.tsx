import type { Metadata } from "next";
import { SectionPage } from "@/components/dashboard/section-page";

export const metadata: Metadata = {
  title: "Planning",
};

export default function PlanningPage() {
  return (
    <SectionPage
      eyebrow="Agenda"
      title="Planning des praticiens"
      description="Agenda par médecin avec disponibilités, vacations et salles configurables en quelques clics."
    />
  );
}

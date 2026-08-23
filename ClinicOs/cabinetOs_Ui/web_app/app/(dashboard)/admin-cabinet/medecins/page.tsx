import type { Metadata } from "next";
import { SectionPage } from "@/components/dashboard/section-page";

export const metadata: Metadata = {
  title: "Médecins",
};

export default function MedecinsPage() {
  return (
    <SectionPage
      eyebrow="Équipe"
      title="Médecins"
      description="Ajoutez et gérez les médecins du cabinet : spécialités, numéros d'ordre, disponibilités et comptes d'accès."
    />
  );
}

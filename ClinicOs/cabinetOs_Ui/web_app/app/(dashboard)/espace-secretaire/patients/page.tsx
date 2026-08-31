import type { Metadata } from "next";
import { SectionPage } from "@/components/dashboard/section-page";

export const metadata: Metadata = {
  title: "Patients",
};

export default function SecretairePatientsPage() {
  return (
    <SectionPage
      eyebrow="Cabinet"
      title="Patients"
      description="Retrouvez le fichier patients du cabinet : coordonnées, historique de rendez-vous et dossiers associés."
    />
  );
}

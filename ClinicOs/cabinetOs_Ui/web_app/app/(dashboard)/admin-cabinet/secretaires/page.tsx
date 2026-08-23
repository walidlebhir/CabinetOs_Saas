import type { Metadata } from "next";
import { SectionPage } from "@/components/dashboard/section-page";

export const metadata: Metadata = {
  title: "Secrétaires",
};

export default function SecretairesPage() {
  return (
    <SectionPage
      eyebrow="Équipe"
      title="Secrétaires"
      description="Créez les comptes secrétaires du cabinet et gérez leurs accès à l'accueil, l'agenda et la facturation."
    />
  );
}

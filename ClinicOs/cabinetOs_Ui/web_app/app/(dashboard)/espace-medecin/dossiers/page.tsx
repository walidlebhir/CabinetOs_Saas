import type { Metadata } from "next";
import { SectionPage } from "@/components/dashboard/section-page";

export const metadata: Metadata = {
  title: "Dossiers médicaux",
};

export default function DossiersPage() {
  return (
    <SectionPage
      eyebrow="Cabinet"
      title="Dossiers médicaux"
      description="Accédez aux dossiers médicaux de vos patients : antécédents, ordonnances et documents."
    />
  );
}

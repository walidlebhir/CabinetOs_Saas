import type { Metadata } from "next";
import { MonProfilMedecin } from "@/components/medecin/mon-profil";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default function ProfilMedecinPage() {
  return <MonProfilMedecin />;
}

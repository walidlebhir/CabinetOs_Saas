import type { Metadata } from "next";
import { MonProfilSecretaire } from "@/components/secretaire/mon-profil";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default function ProfilSecretairePage() {
  return <MonProfilSecretaire />;
}

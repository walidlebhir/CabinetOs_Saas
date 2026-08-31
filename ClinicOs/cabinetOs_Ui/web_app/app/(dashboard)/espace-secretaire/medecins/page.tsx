import type { Metadata } from "next";
import { MedecinsManagerSecretaire } from "@/components/secretaire/medecins-manager";

export const metadata: Metadata = {
  title: "Médecins",
};

export default function SecretaireMedecinsPage() {
  return <MedecinsManagerSecretaire />;
}
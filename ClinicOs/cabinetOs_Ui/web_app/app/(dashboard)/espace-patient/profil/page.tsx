import type { Metadata } from "next";
import { PatientProfile } from "@/components/patient/patient-profile";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default function MonProfilPage() {
  return <PatientProfile />;
}

import type { Metadata } from "next";
import { MedecinPlanningManager } from "@/components/medecin/planning-manager";

export const metadata: Metadata = {
  title: "Mon planning",
};

export default function PlanningMedecinPage() {
  return <MedecinPlanningManager />;
}

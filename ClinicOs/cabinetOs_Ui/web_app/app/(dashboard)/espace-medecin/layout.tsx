import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Espace Médecin",
};

export default function EspaceMedecinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell space="medecin">{children}</DashboardShell>;
}

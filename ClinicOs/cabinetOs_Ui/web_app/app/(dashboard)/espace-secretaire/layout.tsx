import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Espace Secrétaire",
};

export default function EspaceSecretaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell space="secretaire">{children}</DashboardShell>;
}

import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Espace Patient",
};

export default function EspacePatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell space="patient">{children}</DashboardShell>
  );
}

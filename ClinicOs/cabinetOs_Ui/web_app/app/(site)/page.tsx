import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { WorkspaceSection } from "@/components/landing/workspace-section";
import { RolesSection } from "@/components/landing/roles-section";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { AutomationSection } from "@/components/landing/automation-section";
import { AnalyticsSection } from "@/components/landing/analytics-section";
import { SecuritySection } from "@/components/landing/security-section";
import { CloudSection } from "@/components/landing/cloud-section";
import { StatsSection } from "@/components/landing/stats-section";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "MedOS — Le système d'exploitation de votre cabinet médical",
  description:
    "MedOS est une plateforme SaaS qui centralise rendez-vous, planning, patients, dossiers médicaux et pilotage des cabinets médicaux et cliniques.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
        <ProblemSection />
        <SolutionSection />
        <WorkspaceSection />
        <RolesSection />
        <WorkflowSection />
        <AutomationSection />
        <AnalyticsSection />
        <SecuritySection />
        <CloudSection />
        <StatsSection />
      <CtaSection />
    </>
  );
}

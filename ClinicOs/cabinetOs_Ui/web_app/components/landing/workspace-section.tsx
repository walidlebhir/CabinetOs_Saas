import { CheckCircle } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { DashboardMockup } from "@/components/mockups/dashboard-mockup";

const FEATURES = [
  "Planning des médecins",
  "Gestion des rendez-vous",
  "Gestion des patients",
  "Dossiers médicaux",
  "Gestion du personnel",
  "Notifications automatiques",
  "Statistiques",
  "Gestion des abonnements",
];

export function WorkspaceSection() {
  return (
    <section id="solutions" className="scroll-mt-24 bg-white py-20 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-medos-frost" />
            <DashboardMockup className="relative" />
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow="Espace de travail"
            title="Tout votre cabinet."
            highlight="Un seul espace de travail."
            description="MedOS fonctionne comme un véritable système d'exploitation : chaque membre de votre équipe accède aux mêmes données, en temps réel, depuis son propre profil."
          />
          <Reveal delay={150}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm font-medium text-medos-ink"
                >
                  <CheckCircle className="h-4.5 w-4.5 shrink-0 text-medos-teal" />
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

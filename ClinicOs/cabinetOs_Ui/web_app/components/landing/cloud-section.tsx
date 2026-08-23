import {
  Monitor,
  Smartphone,
  Cloud,
  RefreshCw,
  Bell,
} from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { PhoneMockup } from "@/components/mockups/phone-mockup";

const CHANNELS = [
  {
    icon: Monitor,
    title: "Web",
    description: "Dashboard professionnel accessible depuis n'importe quel navigateur.",
  },
  {
    icon: Smartphone,
    title: "Mobile",
    description: "Application patient pour rechercher un médecin et gérer ses rendez-vous.",
  },
  {
    icon: Cloud,
    title: "Cloud",
    description: "Vos données disponibles en continu, sauvegardées et sécurisées.",
  },
  {
    icon: RefreshCw,
    title: "Synchronisation",
    description: "Agendas et dossiers toujours à jour pour toute l'équipe.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Rappels et alertes push, où que vous soyez.",
  },
];

export function CloudSection() {
  return (
    <section id="cloud" className="scroll-mt-24 bg-white py-20 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Accessibilité"
            title="Votre cabinet"
            highlight="accessible partout."
            description="Sur le web au cabinet, sur mobile en déplacement : MedOS suit votre activité où qu'elle se produise."
          />
          <Reveal delay={150}>
            <ul className="mt-9 space-y-4">
              {CHANNELS.map((channel) => (
                <li key={channel.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-medos-line bg-medos-frost">
                    <channel.icon className="h-5 w-5 text-medos-teal" />
                  </span>
                  <div className="leading-snug">
                    <p className="text-sm font-bold text-medos-navy">
                      {channel.title}
                    </p>
                    <p className="mt-0.5 text-sm text-medos-slate">
                      {channel.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-medos-frost" />
          <div className="relative py-6">
            <PhoneMockup />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

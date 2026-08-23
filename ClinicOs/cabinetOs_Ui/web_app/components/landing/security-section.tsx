import {
  KeyRound,
  UserCheck,
  Building2,
  ScrollText,
  Lock,
  FolderLock,
  Cloud,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/ui/reveal";

const SECURITY_ITEMS = [
  {
    icon: KeyRound,
    title: "Authentification sécurisée",
    description: "Accès protégés par des identifiants forts et gérés.",
  },
  {
    icon: UserCheck,
    title: "Contrôle d'accès par rôle",
    description: "Médecin, secrétaire, administrateur : chacun ne voit que son périmètre.",
  },
  {
    icon: Building2,
    title: "Isolation par cabinet",
    description: "Les données de chaque établissement sont strictement séparées.",
  },
  {
    icon: ScrollText,
    title: "Journalisation des accès",
    description: "Chaque action sensible est tracée et consultable.",
  },
  {
    icon: Lock,
    title: "Chiffrement",
    description: "Données protégées en transit et au repos.",
  },
  {
    icon: FolderLock,
    title: "Gestion sécurisée des fichiers",
    description: "Documents médicaux stockés de manière contrôlée.",
  },
  {
    icon: Cloud,
    title: "Infrastructure cloud sécurisée",
    description: "Hébergement fiable avec sauvegardes et supervision.",
  },
];

export function SecuritySection() {
  return (
    <section
      id="securite"
      className="scroll-mt-24 bg-medos-mist py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sécurité"
          title="Vos données médicales méritent une sécurité de"
          highlight="niveau professionnel."
          description="La protection des données de santé guide chaque choix technique de la plateforme."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SECURITY_ITEMS.map((item, index) => (
            <Reveal key={item.title} delay={(index % 4) * 80}>
              <article className="group h-full rounded-2xl border border-medos-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-medos-frost transition-colors group-hover:bg-medos-teal">
                  <item.icon className="h-5 w-5 text-medos-teal transition-colors group-hover:text-white" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-medos-navy">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-medos-slate">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}

          <Reveal delay={280}>
            <div className="flex h-full flex-col justify-center rounded-2xl bg-medos-navy p-6 text-white">
              <ShieldCheck className="h-8 w-8 text-medos-cyan" />
              <p className="mt-4 text-sm font-semibold leading-snug">
                Chaque cabinet reste propriétaire et maître de ses données.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

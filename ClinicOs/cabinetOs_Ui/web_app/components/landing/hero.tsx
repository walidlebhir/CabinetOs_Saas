import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Activity,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardMockup } from "@/components/mockups/dashboard-mockup";

const TRUST_POINTS = ["Simple à configurer", "Sécurisé", "Accessible partout"];

export function Hero() {
  return (
    <section
      id="accueil"
      className="relative overflow-hidden bg-gradient-to-b from-medos-frost via-medos-mist to-white pb-20 pt-32 sm:pt-40"
    >
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-medos-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-52 top-1/2 h-[420px] w-[420px] rounded-full bg-medos-teal/8 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:px-8">
        <div>
          <Badge>
            <Sparkles className="h-3.5 w-3.5" />
            Medical Operating System
          </Badge>

          <h1 className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-medos-navy sm:text-5xl xl:text-[3.4rem]">
            Le système d&rsquo;exploitation de votre{" "}
            <span className="text-medos-teal">cabinet médical</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-medos-slate sm:text-lg">
            Centralisez vos rendez-vous, médecins, patients, dossiers médicaux,
            planning et pilotage dans une seule plateforme.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" href="#commencer">
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="secondary" href="#fonctionnalites">
              Découvrir la plateforme
            </Button>
          </div>

          <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
            {TRUST_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-1.5 text-sm font-medium text-medos-ink/70"
              >
                <CheckCircle className="h-4 w-4 text-medos-teal" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:pl-4">
          <DashboardMockup />
          <div className="absolute -left-6 top-16 hidden items-center gap-3 rounded-xl border border-medos-line bg-white px-4 py-3 shadow-lg shadow-medos-navy/10 xl:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-medos-frost">
              <Activity className="h-4 w-4 text-medos-teal" />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-medium text-medos-slate">
                Taux d&rsquo;occupation
              </p>
              <p className="text-base font-bold tabular-nums text-medos-navy">
                92%
              </p>
            </div>
          </div>
          <div className="absolute -right-5 bottom-14 hidden items-center gap-3 rounded-xl border border-medos-line bg-white px-4 py-3 shadow-lg shadow-medos-navy/10 xl:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-medos-frost">
              <BellRing className="h-4 w-4 text-medos-teal" />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold text-medos-navy">
                Rappel envoyé
              </p>
              <p className="text-[10px] text-medos-slate">
                Automatiquement, avant chaque RDV
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

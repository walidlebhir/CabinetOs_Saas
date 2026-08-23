import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function CtaSection() {
  return (
    <section id="tarifs" className="scroll-mt-24 bg-white pb-20 pt-4 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div
            id="commencer"
            className="relative scroll-mt-28 overflow-hidden rounded-3xl bg-medos-navy px-6 py-16 text-center sm:px-12 md:py-20"
          >
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-medos-teal/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-medos-cyan/15 blur-3xl" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
                backgroundSize: "26px 26px",
              }}
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Prêt à transformer{" "}
                <span className="text-medos-cyan">votre cabinet ?</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-cyan-100/75 sm:text-lg">
                Centralisez votre activité, automatisez vos opérations et
                pilotez votre cabinet depuis une seule plateforme.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Button size="lg" href="#accueil">
                  Commencer gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outlineLight" href="#fonctionnalites">
                  <PlayCircle className="h-5 w-5" />
                  Voir la démonstration
                </Button>
              </div>
              <p className="mt-6 text-xs text-cyan-100/50">
                Sans engagement — configurez votre établissement en quelques
                minutes.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

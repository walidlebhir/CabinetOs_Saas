import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/ui/reveal";

const STATS = [
  { value: "1", label: "plateforme centralisée" },
  { value: "4", label: "types d'utilisateurs" },
  { value: "10+", label: "modules métier" },
  { value: "24/7", label: "accès cloud" },
];

export function StatsSection() {
  return (
    <section id="apropos" className="scroll-mt-24 bg-white pb-20 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="MedOS en bref"
          title="Une plateforme complète,"
          highlight="conçue pour votre établissement."
        />

        <Reveal delay={120}>
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-medos-line bg-medos-line lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-medos-frost px-6 py-10 text-center">
                <dd className="text-4xl font-bold tracking-tight text-medos-navy sm:text-5xl">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-sm font-medium text-medos-slate">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-medos-slate">
            Des capacités conçues pour couvrir l&rsquo;ensemble des besoins d&rsquo;un
            cabinet médical ou d&rsquo;une clinique, sans multiplier les outils.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

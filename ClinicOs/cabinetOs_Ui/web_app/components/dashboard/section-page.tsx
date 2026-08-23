import { Construction } from "lucide-react";

type SectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionPage({ eyebrow, title, description }: SectionPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-medos-slate">{description}</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-medos-line bg-white px-6 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
          <Construction className="h-5 w-5 text-medos-teal" />
        </span>
        <h2 className="mt-4 text-lg font-bold text-medos-navy">
          Module en cours de construction
        </h2>
        <p className="mt-1.5 max-w-md text-sm text-medos-slate">
          Cette section sera bientôt disponible. Les données seront connectées à
          l&apos;API du backend.
        </p>
      </div>
    </div>
  );
}

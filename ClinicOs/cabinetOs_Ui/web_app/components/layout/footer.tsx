import { Globe, AtSign, Mail, Send } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const COLUMNS = [
  {
    title: "Produit",
    links: ["Fonctionnalités", "Solutions", "Tarifs", "Sécurité"],
  },
  {
    title: "Solutions",
    links: ["Cabinets médicaux", "Cliniques", "Médecins", "Secrétaires"],
  },
  {
    title: "Ressources",
    links: ["Documentation", "FAQ", "Centre d'aide", "Contact"],
  },
  {
    title: "Entreprise",
    links: [
      "À propos",
      "Contact",
      "Conditions",
      "Politique de confidentialité",
    ],
  },
];

const SOCIALS = [
  { label: "Site web", icon: Globe },
  { label: "Réseaux sociaux", icon: AtSign },
  { label: "Newsletter", icon: Send },
  { label: "Email", icon: Mail },
];

export function Footer() {
  return (
    <footer className="bg-medos-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo dark />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cyan-100/70">
              Une plateforme SaaS complète pour gérer et piloter les cabinets
              médicaux et les cliniques.
            </p>
            <div className="mt-8 flex items-center gap-3">
              {SOCIALS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#accueil"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-cyan-100/80 transition-colors hover:border-medos-teal hover:bg-medos-teal hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  {column.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#accueil"
                        className="text-sm text-cyan-100/70 transition-colors hover:text-medos-cyan"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-cyan-100/60">
            © {new Date().getFullYear()} MedOS — Medical Operating System.
            Tous droits réservés.
          </p>
          <a
            href="#accueil"
            className="flex items-center gap-2 text-xs text-cyan-100/60 transition-colors hover:text-medos-cyan"
          >
            <Mail className="h-3.5 w-3.5" />
            contact@medos.fr
          </a>
        </div>
      </div>
    </footer>
  );
}

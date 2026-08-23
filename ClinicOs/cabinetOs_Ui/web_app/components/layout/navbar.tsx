"use client";

import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, LogIn, UserPlus } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pour les cabinets", href: "/cabinet" },
  { label: "Pour les cliniques", href: "#cliniques" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "À propos", href: "#apropos" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled || open
          ? "border-medos-line bg-white/90 shadow-[0_4px_24px_-12px_rgba(6,59,92,0.18)] backdrop-blur-md"
          : "border-transparent bg-white/60 backdrop-blur-sm"
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-16" : "h-20"
        )}
      >
        <div className="flex items-center gap-6 xl:gap-10">
          <a href="#accueil" aria-label="MedOS — Accueil">
            <Logo />
          </a>

          <nav className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-medos-ink/80 transition-colors hover:bg-medos-frost hover:text-medos-teal-dark"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <Button variant="link" size="sm" href="/login">
            <LogIn className="h-4 w-4" />
            Connexion
          </Button>
          <Button size="sm" href="/register">
            <UserPlus className="h-4 w-4" />
            Commencer gratuitement
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-medos-line bg-white text-medos-navy lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-medos-line bg-white px-4 pb-6 pt-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-medos-ink transition-colors hover:bg-medos-frost hover:text-medos-teal-dark"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 text-medos-line" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <Button variant="secondary" href="/login" onClick={() => setOpen(false)}>
              <LogIn className="h-4 w-4" />
              Connexion
            </Button>
            <Button href="/register" onClick={() => setOpen(false)}>
              <UserPlus className="h-4 w-4" />
              Commencer gratuitement
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}

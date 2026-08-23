"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import {
  ADMIN_SIDEBAR_SECTIONS,
  type SidebarSection,
} from "@/components/dashboard/nav-config";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  sections?: SidebarSection[];
  brandTitle?: string;
  brandRole?: string;
};

export function DashboardSidebar({
  mobileOpen,
  onCloseMobile,
  sections = ADMIN_SIDEBAR_SECTIONS,
  brandTitle = "Espace cabinet",
  brandRole = "Administrateur",
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const homeHref = sections[0]?.items[0]?.href ?? "/";

  const isActive = (href: string) =>
    href === homeHref ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-medos-navy-deep/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-medos-line bg-white transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-medos-line px-5">
          <Link href={homeHref} aria-label={brandTitle}>
            <Logo />
          </Link>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={onCloseMobile}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-medos-line text-medos-navy lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-medos-slate/70">
                {section.label}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onCloseMobile}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-medos-frost text-medos-teal-dark shadow-[inset_2px_0_0_0_var(--color-medos-teal)]"
                          : "text-medos-ink/75 hover:bg-medos-mist hover:text-medos-teal-dark"
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-medos-line p-4">
          <div className="flex items-center gap-3 rounded-xl bg-medos-frost p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-medos-teal text-xs font-bold text-white">
              AC
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-medos-navy">
                {brandTitle}
              </p>
              <p className="text-[11px] text-medos-slate">{brandRole}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

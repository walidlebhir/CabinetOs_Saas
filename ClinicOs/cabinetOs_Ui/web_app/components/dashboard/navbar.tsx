"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  Globe,
  LogOut,
  ChevronDown,
  Settings,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CabinetSwitcher } from "@/components/admin/cabinet-switcher";
import {
  clearSession,
  decodeJwtPayload,
  accessTokenStore,
  type SessionUser,
} from "@/lib/auth-storage";

type DashboardNavbarProps = {
  onOpenMobile: () => void;
  displayName?: string;
  settingsHref?: string;
};

export function DashboardNavbar({
  onOpenMobile,
  displayName = "Admin cabinet",
  settingsHref = "/admin-cabinet/parametres",
}: DashboardNavbarProps) {
  const router = useRouter();
  const accessToken = useSyncExternalStore(
    accessTokenStore.subscribe,
    accessTokenStore.getSnapshot,
    accessTokenStore.getServerSnapshot
  );
  const user = useMemo<SessionUser | null>(() => {
    if (!accessToken) return null;
    const payload = decodeJwtPayload(accessToken);
    if (!payload?.sub || !payload.role) return null;
    return { email: payload.sub, role: payload.role };
  }, [accessToken]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = useMemo(() => {
    return (
      displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("") || "AD"
    );
  }, [displayName]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    clearSession();
    setMenuOpen(false);
    toast.success("Vous avez été déconnecté.");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-medos-line bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        type="button"
        aria-label="Ouvrir le menu"
        onClick={onOpenMobile}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-medos-line text-medos-navy lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden w-full max-w-sm md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-medos-slate/70" />
        <Input
          type="search"
          placeholder="Rechercher un patient, un rendez-vous…"
          className="pl-9"
          aria-label="Recherche"
        />
      </div>

      {user?.role === "ADMIN" && <CabinetSwitcher email={user.email} />}

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Button variant="secondary" size="sm" href="/" className="hidden sm:inline-flex">
          <Globe className="h-4 w-4" />
          Site web
        </Button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-medos-line bg-white text-medos-navy transition-colors hover:border-medos-teal/40 hover:bg-medos-frost"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-medos-line" />

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-medos-frost"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-medos-navy text-xs font-bold text-white">
              {initials}
            </span>
            <span className="hidden text-left leading-tight lg:block">
              <span className="block text-sm font-semibold text-medos-navy">
                {displayName}
              </span>
              <span className="block max-w-[160px] truncate text-[11px] text-medos-slate">
                {user?.email ?? "Non connecté"}
              </span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-medos-slate lg:block" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-medos-line bg-white shadow-lg shadow-medos-navy/10"
            >
              <div className="border-b border-medos-line px-4 py-3">
                <p className="text-sm font-semibold text-medos-navy">{displayName}</p>
                <p className="truncate text-xs text-medos-slate">
                  {user?.email ?? "—"}
                </p>
              </div>
              <Link
                href={settingsHref}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-medos-ink transition-colors hover:bg-medos-frost hover:text-medos-teal-dark"
              >
                <Settings className="h-4 w-4" />
                Paramètres du compte
              </Link>
              <Link
                href={settingsHref}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-medos-ink transition-colors hover:bg-medos-frost hover:text-medos-teal-dark"
              >
                <UserRound className="h-4 w-4" />
                Mon profil
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 border-t border-medos-line px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

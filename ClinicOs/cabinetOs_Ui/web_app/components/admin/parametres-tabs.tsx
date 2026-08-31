"use client";

import { useState } from "react";
import { Building2, UserRound } from "lucide-react";
import { CabinetConfig } from "@/components/admin/cabinet-config";
import { MonProfilMedecin } from "@/components/medecin/mon-profil";

const TABS = [
  { id: "cabinet", label: "Cabinet", icon: Building2 },
  { id: "profil", label: "Mon profil", icon: UserRound },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ParametresTabs() {
  const [tab, setTab] = useState<TabId>("cabinet");

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Sections des paramètres"
        className="flex w-fit max-w-full gap-1.5 overflow-x-auto rounded-xl border border-medos-line bg-white p-1.5 shadow-sm"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-medos-teal text-white shadow-sm"
                  : "text-medos-slate hover:bg-medos-frost hover:text-medos-navy"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "cabinet" ? <CabinetConfig /> : <MonProfilMedecin />}
    </div>
  );
}

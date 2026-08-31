"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import {
  DASHBOARD_SPACES,
  type DashboardSpace,
} from "@/components/dashboard/nav-config";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: React.ReactNode;
  space?: DashboardSpace;
};

export function DashboardShell({
  children,
  space = "admin",
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const config = DASHBOARD_SPACES[space];

  return (
    <div className="min-h-screen bg-medos-mist">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        sections={config.sections}
        brandTitle={config.brandTitle}
        brandRole={config.brandRole}
      />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <DashboardNavbar
          onOpenMobile={() => setMobileOpen(true)}
          displayName={config.displayName}
          settingsHref={config.settingsHref}
          profileHref={config.profileHref}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function DashboardPageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
    </div>
  );
}

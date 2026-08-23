import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  UserCog,
  CalendarRange,
  FolderOpen,
  BarChart3,
  Settings,
  Home,
  Building2,
  UserRound,
} from "lucide-react";

export type SidebarNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type SidebarSection = {
  label: string;
  items: SidebarNavItem[];
};

export const ADMIN_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: "Général",
    items: [
      {
        title: "Tableau de bord",
        href: "/admin-cabinet",
        icon: LayoutDashboard,
      },
      { title: "Rendez-vous", href: "/admin-cabinet/rendez-vous", icon: CalendarDays },
      { title: "Planning", href: "/admin-cabinet/planning", icon: CalendarRange },
    ],
  },
  {
    label: "Cabinet",
    items: [
      { title: "Patients", href: "/admin-cabinet/patients", icon: Users },
      { title: "Médecins", href: "/admin-cabinet/medecins", icon: Stethoscope },
      { title: "Secrétaires", href: "/admin-cabinet/secretaires", icon: UserCog },
      {
        title: "Dossiers médicaux",
        href: "/admin-cabinet/dossiers",
        icon: FolderOpen,
      },
    ],
  },
  {
    label: "Pilotage",
    items: [
      { title: "Statistiques", href: "/admin-cabinet/statistiques", icon: BarChart3 },
      { title: "Paramètres", href: "/admin-cabinet/parametres", icon: Settings },
    ],
  },
];

export const PATIENT_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: "Général",
    items: [
      { title: "Accueil", href: "/espace-patient", icon: Home },
      { title: "Cabinets", href: "/espace-patient/cabinets", icon: Building2 },
    ],
  },
  {
    label: "Santé",
    items: [
      {
        title: "Mes rendez-vous",
        href: "/espace-patient/rendez-vous",
        icon: CalendarDays,
      },
      { title: "Mon profil", href: "/espace-patient/profil", icon: UserRound },
    ],
  },
];

export type DashboardSpace = "admin" | "patient";

export type DashboardSpaceConfig = {
  sections: SidebarSection[];
  brandTitle: string;
  brandRole: string;
  displayName: string;
  settingsHref: string;
};

export const DASHBOARD_SPACES: Record<DashboardSpace, DashboardSpaceConfig> = {
  admin: {
    sections: ADMIN_SIDEBAR_SECTIONS,
    brandTitle: "Espace cabinet",
    brandRole: "Administrateur",
    displayName: "Admin cabinet",
    settingsHref: "/admin-cabinet/parametres",
  },
  patient: {
    sections: PATIENT_SIDEBAR_SECTIONS,
    brandTitle: "Espace patient",
    brandRole: "Patient",
    displayName: "Patient",
    settingsHref: "/espace-patient/profil",
  },
};

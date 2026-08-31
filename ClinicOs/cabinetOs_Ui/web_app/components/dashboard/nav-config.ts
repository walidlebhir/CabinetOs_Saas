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

export const MEDECIN_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: "Général",
    items: [
      {
        title: "Tableau de bord",
        href: "/espace-medecin",
        icon: LayoutDashboard,
      },
      { title: "Rendez-vous", href: "/espace-medecin/rendez-vous", icon: CalendarDays },
      { title: "Mon planning", href: "/espace-medecin/planning", icon: CalendarRange },
    ],
  },
  {
    label: "Cabinet",
    items: [
      { title: "Patients", href: "/espace-medecin/patients", icon: Users },
      {
        title: "Dossiers médicaux",
        href: "/espace-medecin/dossiers",
        icon: FolderOpen,
      },
    ],
  },
];

export const SECRETAIRE_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: "Général",
    items: [
      {
        title: "Tableau de bord",
        href: "/espace-secretaire",
        icon: LayoutDashboard,
      },
      { title: "Rendez-vous", href: "/espace-secretaire/rendez-vous", icon: CalendarDays },
    ],
  },
  {
    label: "Cabinet",
    items: [
      { title: "Patients", href: "/espace-secretaire/patients", icon: Users },
      { title: "Médecins", href: "/espace-secretaire/medecins", icon: Stethoscope },
      { title: "Mon profil", href: "/espace-secretaire/profil", icon: UserRound },
    ],
  },
];

export type DashboardSpace = "admin" | "patient" | "medecin" | "secretaire";

export type DashboardSpaceConfig = {
  sections: SidebarSection[];
  brandTitle: string;
  brandRole: string;
  displayName: string;
  settingsHref: string;
  profileHref: string;
};

export const DASHBOARD_SPACES: Record<DashboardSpace, DashboardSpaceConfig> = {
  admin: {
    sections: ADMIN_SIDEBAR_SECTIONS,
    brandTitle: "Espace cabinet",
    brandRole: "Administrateur",
    displayName: "Admin cabinet",
    settingsHref: "/admin-cabinet/parametres",
    profileHref: "/admin-cabinet/profil",
  },
  patient: {
    sections: PATIENT_SIDEBAR_SECTIONS,
    brandTitle: "Espace patient",
    brandRole: "Patient",
    displayName: "Patient",
    settingsHref: "/espace-patient/profil",
    profileHref: "/espace-patient/profil",
  },
  medecin: {
    sections: MEDECIN_SIDEBAR_SECTIONS,
    brandTitle: "Espace médecin",
    brandRole: "Médecin",
    displayName: "Docteur",
    settingsHref: "/espace-medecin",
    profileHref: "/espace-medecin/profil",
  },
  secretaire: {
    sections: SECRETAIRE_SIDEBAR_SECTIONS,
    brandTitle: "Espace secrétaire",
    brandRole: "Secrétariat",
    displayName: "Secrétaire",
    settingsHref: "/espace-secretaire",
    profileHref: "/espace-secretaire/profil",
  },
};

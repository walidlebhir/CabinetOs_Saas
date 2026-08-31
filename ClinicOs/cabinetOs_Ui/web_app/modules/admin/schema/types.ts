export type Medecin = {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  numeroOrder: string;
  teliphone: string | null;
  biographie: string | null;
  anneesExperience: number;
  email: string | null;
  hasAccount: boolean;
  accountId: string | null;
  accountActive: boolean | null;
  cabinetId: string | null;
  cabinetNom: string | null;
};

export type MedecinPayload = {
  nom: string;
  prenom: string;
  specialite: string;
  numeroOrder: string;
  teliphone: string | null;
  biographie: string | null;
  anneesExperience: number;
  cabinetId: string;
};

export type MedecinUpdatePayload = {
  id: string;
  nom?: string;
  prenom?: string;
  specialite?: string;
  numeroOrder?: string;
  teliphone?: string | null;
  biographie?: string | null;
  anneesExperience?: number;
};

export type MedecinAccount = {
  medecinId: string;
  email: string;
  generatedPassword?: string;
};

export type MedecinImportResult = {
  totalRows: number;
  importes: number;
  erreurs: { ligne: number; message: string }[];
};

export type Secretaire = {
  id: string;
  nom: string;
  prenom: string;
  teliphone: string | null;
  adress: string | null;
  email: string | null;
  dateEmbauche: string | null;
};

export type SecretairePayload = {
  nom: string;
  prenom: string;
  teliphone: string | null;
  adress: string | null;
  dateEmbauche: string | null;
  cabinetId: string;
};

export type SecretaireUpdatePayload = {
  id: string;
  nom?: string;
  prenom?: string;
  teliphone?: string | null;
  adresse?: string | null;
  dateEmbauche?: string | null;
  cabinetId?: string;
};

export const WEEK_DAYS = [
  "LUNDI",
  "MARDI",
  "MERCREDI",
  "JEUDI",
  "VENDREDI",
  "SAMEDI",
  "DIMANCHE",
] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

export const TYPE_INDISPONIBILITES = [
  "CONGE",
  "URGENCE",
  "FORMATION",
  "AUTRE",
] as const;

export type TypeIndisponibilite = (typeof TYPE_INDISPONIBILITES)[number];

export type Disponibilite = {
  id: number;
  medecinId: string;
  nomMedecin: string;
  joursemaine: WeekDay;
  heurDebut: string;
  heurFin: string;
  dureCreneau: number;
  pauseDebut: string | null;
  pauseFin: string | null;
  actif: boolean;
  createdAt: string;
};

export type DisponibilitePayload = {
  medecinId: string;
  joursemaine: WeekDay;
  heurDebut: string;
  heurFin: string;
  dureCreneau: number;
  pauseDebut?: string | null;
  pauseFin?: string | null;
  actif?: boolean;
};

export type DisponibiliteUpdatePayload = {
  id: number;
  medecinId: string;
  joursemaine?: WeekDay;
  heurDebut?: string;
  heurFin?: string;
  dureCreneau?: number;
  pauseDebut?: string | null;
  pauseFin?: string | null;
  actif?: boolean;
};

export type Indisponibilite = {
  id: number;
  medecinId: string;
  nomMedecin: string;
  dateDebut: string;
  dateFin: string;
  motif: string | null;
  type: TypeIndisponibilite;
  createdAt: string;
};

export type IndisponibilitePayload = {
  medecinId: string;
  dateDebut: string;
  dateFin: string;
  motif?: string | null;
  type: TypeIndisponibilite;
};

export type IndisponibiliteUpdatePayload = {
  id: number;
  medecinId: string;
  dateDebut?: string;
  dateFin?: string;
  motif?: string | null;
  type?: TypeIndisponibilite;
};

export type DisponibiliteCreateItem = {
  joursemaine: WeekDay;
  heurDebut: string;
  heurFin: string;
  dureCreneau: number;
  pauseDebut?: string | null;
  pauseFin?: string | null;
  actif?: boolean;
};

export type IndisponibiliteCreateItem = {
  dateDebut: string;
  dateFin: string;
  motif?: string | null;
  type: TypeIndisponibilite;
};

export type PlanningCreatePayload = {
  disponibilites?: DisponibiliteCreateItem[];
  indisponibilites?: IndisponibiliteCreateItem[];
};

export type PlanningResponse = {
  disponibilites: Disponibilite[];
  indisponibilites: Indisponibilite[];
};

export type DisponibiliteMeUpdatePayload = Omit<
  DisponibiliteUpdatePayload,
  "medecinId"
>;

export type IndisponibiliteMeUpdatePayload = Omit<
  IndisponibiliteUpdatePayload,
  "medecinId"
>;

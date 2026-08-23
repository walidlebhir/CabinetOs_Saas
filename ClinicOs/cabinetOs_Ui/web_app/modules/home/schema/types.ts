export type CabinetStatus = "ACTIF" | "INACTIF";

export type CabinetHome = {
  id: string;
  nom: string;
  specialite: string;
  ville: string | null;
  localisation: string | null;
  status: CabinetStatus;
  nombreMedecins: number;
};

export type MedecinDetail = {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  numeroOrder: string;
  teliphone: string | null;
  biographie: string | null;
  anneesExperience: number;
};

export type CabinetDetail = {
  id: string;
  nom: string;
  specialite: string;
  ville: string | null;
  localisation: string | null;
  status: CabinetStatus;
  medecins: MedecinDetail[];
};

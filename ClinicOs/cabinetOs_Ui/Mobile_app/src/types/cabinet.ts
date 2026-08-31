export type CabinetStatus = 'ACTIF' | 'INACTIF';

export type CabinetHome = {
  id: string;
  nom: string;
  specialite: string;
  ville: string | null;
  localisation: string | null;
  status: CabinetStatus;
  nombreMedecins: number;
  latitude: number | null;
  longitude: number | null;
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

export type WeekDay = string;

export type DisponibiliteMedecin = {
  id: number;
  joursemaine: WeekDay;
  heurDebut: string;
  heurFin: string;
  dureCreneau: number;
  pauseDebut: string | null;
  pauseFin: string | null;
  actif: boolean | null;
};

export type MedecinProfilDetail = {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  numeroOrder: string;
  teliphone: string | null;
  biographie: string | null;
  anneesExperience: number;
  disponibilites: DisponibiliteMedecin[];
};

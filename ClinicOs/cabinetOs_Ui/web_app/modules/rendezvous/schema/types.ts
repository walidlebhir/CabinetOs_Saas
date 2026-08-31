export const RENDEZVOUS_STATUSES = [
  "EN_ATTENTE",
  "CONFIRME",
  "ANNULE",
  "TERMINE",
  "ABSENT",
] as const;

export type RendezvousStatus = (typeof RENDEZVOUS_STATUSES)[number];

export type Rendezvous = {
  id: string;
  patientId: string;
  nomPatient: string | null;
  medecinId: string;
  nomMedecin: string;
  creeParId: string;
  dateRendezvous: string;
  heureDebut: string;
  heureFin: string;
  status: RendezvousStatus;
  motif: string | null;
};

export type RendezvousCreatePayload = {
  id_patient?: string;
  id_medecin: string;
  date_rendezvous: string;
  heur_debut: string;
  heur_fin: string;
  motif?: string;
};

export type Creneau = {
  heureDebut: string;
  heureFin: string;
  libre: boolean;
};

export type DisponibiliteMedecin = {
  id: number;
  joursemaine: string;
  heurDebut: string;
  heurFin: string;
  dureCreneau: number;
  pauseDebut: string | null;
  pauseFin: string | null;
  actif: boolean;
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

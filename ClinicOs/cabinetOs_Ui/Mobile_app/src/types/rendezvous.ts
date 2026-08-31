export type RendezvousStatus =
  | 'EN_ATTENTE'
  | 'CONFIRME'
  | 'TERMINE'
  | 'ANNULE'
  | 'ABSENT';

export type Rendezvous = {
  id: string;
  patientId: string;
  nomPatient: string;
  medecinId: string;
  nomMedecin: string;
  creeParId: string;
  dateRendezvous: string;
  heureDebut: string;
  heureFin: string;
  status: RendezvousStatus;
  motif: string | null;
};

export type RendezvousRequest = {
  id_patient: string;
  id_medecin: string;
  date_rendezvous: string;
  heur_debut: string;
  heur_fin: string;
  motif?: string;
};

export type CreneauDisponibilite = {
  heureDebut: string;
  heureFin: string;
  libre: boolean;
};

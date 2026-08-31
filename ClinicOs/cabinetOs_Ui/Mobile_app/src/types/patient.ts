export type Sex = 'HOMME' | 'FEMME';

export type PatientResponse = {
  id: string;
  name: string;
  email: string;
  date_naissance: string | null;
  sex: Sex | null;
  groupe_sanguin: string | null;
  allergie: string | null;
  antecedents: string | null;
  adresse: string | null;
  ville: string | null;
};

export type PatientInfoRequest = {
  date_naissance: string;
  sex: Sex;
  groupe_sanguin: string;
  allergie?: string;
  antecedents?: string;
  adresse: string;
  ville: string;
};

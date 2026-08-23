export type Sex = "HOME" | "FEM";

export type PatientInfo = {
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

export type PatientInfoPayload = {
  date_naissance: string;
  sex: Sex;
  groupe_sanguin: string;
  allergie: string | null;
  antecedents: string | null;
  adresse: string;
  ville: string;
};

export function hasPatientInfo(patient: PatientInfo): boolean {
  return Boolean(patient.date_naissance && patient.sex);
}

export const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "HOME", label: "Homme" },
  { value: "FEM", label: "Femme" },
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function sexLabel(sex: Sex | null): string {
  return SEX_OPTIONS.find((option) => option.value === sex)?.label ?? "—";
}

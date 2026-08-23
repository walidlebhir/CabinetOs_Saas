export type CabinetStatus = "ACTIF" | "INACTIF";

export type AdminCabinet = {
  id: string;
  nom: string;
  specialite: string;
  ville: string;
  localisation: string | null;
  status: CabinetStatus;
};

export type CabinetPayload = {
  nom: string;
  specialite: string;
  ville: string;
  status: CabinetStatus;
  localisation: string | null;
};

export function statusLabel(status: CabinetStatus): string {
  return status === "ACTIF" ? "Actif" : "Inactif";
}

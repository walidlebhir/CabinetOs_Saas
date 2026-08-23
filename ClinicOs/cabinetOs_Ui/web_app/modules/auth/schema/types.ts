export type AdminRegisterPayload = {
  nom: string;
  prenom: string;
  specialite: string;
  numeroOrder: string;
  teliphone: string;
  Biographie: string;
  annes_experience: number;
  name: string;
  email: string;
  password: string;
};

export type PatientRegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export type ApiErrorResponse = {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
};

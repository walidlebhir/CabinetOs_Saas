export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

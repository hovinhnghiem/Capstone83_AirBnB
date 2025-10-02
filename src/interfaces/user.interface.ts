export type Role = "ADMIN" | "USER";

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  birthday?: string;
  gender?: boolean;
  role: Role;
  avatar?: string;
}

export interface AddUserValues {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: "ADMIN" | "USER";
}

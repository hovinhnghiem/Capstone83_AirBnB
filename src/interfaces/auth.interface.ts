export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  birthday: string;
  gender: boolean;
  role: "ADMIN" | "USER";
  avatar?: string;
  accessToken: string;
}

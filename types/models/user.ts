
export type UserRole = "admin" | "client" | "user";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}
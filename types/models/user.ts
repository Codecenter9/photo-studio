export type UserRole = "admin" | "client" | "user";

export interface IUserPermissions {
  canDownload: boolean;
  canShare: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;

  permissions: IUserPermissions;

  status?: "active" | "blocked";
  avatar?: string;
  lastLogin?: string;

  createdAt?: string;
  updatedAt?: string;
}
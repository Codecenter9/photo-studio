import { DefaultSession } from "next-auth";

 export interface IUserPermissions {
  canDownload: boolean;
  canShare: boolean;
}
declare module "next-auth" {
  interface Session {
    user: {
      id: string;      
      role: string;
      name:string;
      phone:string;
      email:string;
      permissions: IUserPermissions;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;       
    role: string;
    name:string;
    phone:string;
    email:string;
    permissions: IUserPermissions;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;        
    role: string;
    phone:string;
    permissions: IUserPermissions;
  }
}
// types/folder.ts

export interface IFolder {
  _id: string;
  name: string;
  clientId: string;
  createdBy:string;
  status: "UnEdited" | "Edited";
  createdAt?: string;
  updatedAt?: string;
}
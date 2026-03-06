
export interface IFile {
  _id: string;

  fileName: string;

  folderId: string;
  clientId: string;

  publicId: string;
  secureUrl: string;

  resourceType?: string;
  size?: number;
  format?: string;

  uploadedBy: string;
  isPublic:boolean;

  status: "UnEdited" | "Edited" | "Rejected";

  selectionStatus: "Selected" | "UnSelected" | "Approved" | "Rejected";

  createdAt: Date;
  updatedAt: Date;
}
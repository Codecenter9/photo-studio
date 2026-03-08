import { Types } from "mongoose";
import { IUser } from "./user";

export interface ISchedule {
  _id:string;
   clientId: IUser | Types.ObjectId; 

  scheduleType?: string | null;

  eventDate?: Date | null;

  editingDate?: Date | null;

  deliveryDate?: Date | null;

  isVisibleForClient:boolean;

  status?: "booked" | "editing" | "completed" | "cancelled";

  photographerId?: Types.ObjectId | null;

  notes?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

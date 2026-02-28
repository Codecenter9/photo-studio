import { Types } from "mongoose";
import { IUser } from "./user";

export interface ISchedule {
  _id:string;
   clientId: IUser | Types.ObjectId; 

  scheduleType?: string | null;

  eventDate?: Date | null;

  editingDate?: Date | null;

  deliveryDate?: Date | null;

  status?: "Booked" | "Editing" | "Completed" | "Delivered" | "Cancelled";

  photographerId?: Types.ObjectId | null;

  notes?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

import  { model, models, Schema } from "mongoose";

const scheduleSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scheduleType: {
      type: String,
      trim: true,
      default: null,
    },

    eventDate: {
      type: Date,
      default: null,
    },
    
    editingDate: {
      type: Date,
      default: null,
    },

    deliveryDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "booked",
        "editing",
        "completed",
        "cancelled",
      ],
      default: "Booked",
    },

    photographerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

export default models.Schedule || model("Schedule", scheduleSchema);
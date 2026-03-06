// models/ClientShare.ts

import  { model, models, Schema } from "mongoose";

const ClientShareSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  token: {
    type: String,
    unique: true,
  },

  active: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.ClientShare ||
  model("ClientShare", ClientShareSchema);
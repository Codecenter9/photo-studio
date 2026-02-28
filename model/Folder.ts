import mongoose, { model, models, Schema } from "mongoose";

const FolderSchema = new Schema({
  name: { type: String, required: true },
  clientId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String,  enum: ["UnEdited", "Edited"],default: "UnEdited"},
  createdAt: { type: Date, default: Date.now },
});

export default models.Folder || model("Folder", FolderSchema);
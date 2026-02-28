import  { Schema, model, models } from "mongoose";

const fileSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
      index: true,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
      index: true,
    },

    publicId: {
      type: String,
      required: true,
      unique: true, 
    },

    secureUrl: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      default: "image",
    },

    size: {
      type: Number,
    },

    format: {   
      type: String,
    },

    uploadedBy: { 
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["UnEdited", "Edited"],
      default: "UnEdited",
    },

  selectionStatus: {
    type: String,
    enum: ["Selected", "UnSelected", "Approved", "Rejected"],
    default: "UnSelected",
  }
},
  {
    timestamps: true, 
  }
);

fileSchema.index({ folderId: 1, clientId: 1 });

export default models.Photo || model("Photo", fileSchema);
import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, 
    },

    phone: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "client", "user"],
      default: "user",
    },

    permissions: {
      canDownload: {
        type: Boolean,
        default: false,
      },

      canShare: {
        type: Boolean,
        default: false,
      },
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    avatar: {
      type: String, 
    },

  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;
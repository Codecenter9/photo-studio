import { Schema, models, model } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    phone:String,
    role: {
    type: String,
    enum: ["admin", "client","user"],
    default: "user",
  },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;

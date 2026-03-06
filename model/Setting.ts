import  { model, models, Schema } from "mongoose";

const SettingsSchema = new Schema(
    {
        allowUserRegistration: {
            type: Boolean,
            default: true,
        },

        allowClientBooking: {
            type: Boolean,
            default: true,
        },

        studioName: {
            type: String,
            default: "My Photo Studio",
        },

        studioEmail: {
            type: String,
        },

        studioPhone: {
            type: String,
        },

        studioAddress: {
            type: String,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    });

export default models.Settings ||
    model("Settings", SettingsSchema);
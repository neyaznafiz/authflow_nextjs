import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
        },
        identifier: {
            type: String,
            required: [true, "Please provide an email or phone number"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        resetToken: {
            type: String,
            default: null,
        },
        resetTokenExpiry: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

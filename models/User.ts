/**
 * Model: User
 * Description: MongoDB Schema for user authentication, session management, and verification.
 */
import mongoose from "mongoose";
import { v7 as uuidv7 } from "uuid";

const UserSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: uuidv7,
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Please provide a name"],
        },
        identifier: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        reset_token: {
            type: String,
            default: null,
        },
        reset_token_expiry: {
            type: Number,
            default: null,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verification_otp: {
            type: String,
            default: null,
        },
        active_token: {
            type: String,
            default: null,
        },
        refresh_token: {
            type: String,
            default: null,
        },
        created_at: {
            type: Number,
        },
        updated_at: {
            type: Number,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
            currentTime: () => Date.now(),
        },
    },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

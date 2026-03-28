import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { identifier } = await req.json();

        if (!identifier) {
            return NextResponse.json(
                { message: "Please provide an email or phone number" },
                { status: 400 },
            );
        }

        await dbConnect();

        const user = await User.findOne({ identifier });

        if (!user) {
            // For security, don't reveal if user exists
            return NextResponse.json(
                {
                    message:
                        "If an account exists with that identifier, a reset link will be sent.",
                },
                { status: 200 },
            );
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        user.reset_token = resetToken;
        user.reset_token_expiry = resetTokenExpiry;
        await user.save();

        // Log the reset link (simulating email)
        const appUrl = process.env.APP_URL || "http://localhost:3000";
        const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

        console.log("------------------------------------------");
        console.log(`PASSWORD RESET REQUEST FOR: ${identifier}`);
        console.log(`RESET LINK: ${resetLink}`);
        console.log("------------------------------------------");

        return NextResponse.json(
            {
                message:
                    "If an account exists with that identifier, a reset link will be sent.",
                resetLink,
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}

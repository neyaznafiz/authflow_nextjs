/**
 * API Route: /api/auth/resend-otp
 * Description: Generates and returns a new 6-digit OTP for unverified user accounts.
 * Method: POST
 * Access: Public
 */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { identifier } = await req.json();

        if (!identifier) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 },
            );
        }

        const user = await User.findOne({ identifier });
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 },
            );
        }

        if (user.verified) {
            return NextResponse.json(
                { message: "User is already verified" },
                { status: 400 },
            );
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.verification_otp = otp;
        await user.save();

        console.log(`[DEV] Resend OTP for ${identifier}: ${otp}`);

        return NextResponse.json(
            {
                message: "OTP resent successfully",
                otp: otp,
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Resend OTP error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}

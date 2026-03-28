import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { identifier, otp } = await req.json();

        if (!identifier || !otp) {
            return NextResponse.json(
                { message: "Email and OTP are required" },
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

        if (user.verification_otp !== otp) {
            return NextResponse.json(
                { message: "Invalid OTP" },
                { status: 400 },
            );
        }

        // Verify user
        user.verified = true;
        user.verification_otp = null;
        await user.save();

        return NextResponse.json(
            { message: "Email verified successfully" },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}

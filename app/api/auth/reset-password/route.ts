import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import mongodb from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { message: "Token and password are required" },
                { status: 400 },
            );
        }

        await mongodb;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired reset token" },
                { status: 400 },
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update user
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        return NextResponse.json(
            { message: "Password reset successful" },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}

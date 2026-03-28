/**
 * API Route: /api/auth/signup
 * Description: Registers a new user account and generates an initial 6-digit verification OTP.
 * Method: POST
 * Access: Public
 */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, identifier, password } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ identifier });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 },
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create user
        const user = await User.create({
            name,
            identifier,
            password: hashedPassword,
            verified: false,
            verification_otp: otp,
        });

        console.log(`[DEV] OTP for ${identifier}: ${otp}`);

        return NextResponse.json(
            {
                message: "User created successfully",
                userId: user._id,
                otp: otp,
            },
            { status: 201 },
        );
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}

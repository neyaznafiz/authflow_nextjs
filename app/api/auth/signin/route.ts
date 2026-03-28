/**
 * API Route: /api/auth/signin
 * Description: Authenticates user credentials and issues a dual-token payload (JWT + Refresh Cookie).
 * Method: POST
 * Access: Public
 */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { identifier, password } = await req.json();

        // Find user
        const user = await User.findOne({ identifier });
        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 },
            );
        }

        if (!user.verified) {
            return NextResponse.json(
                { message: "Please verify your account first." },
                { status: 403 },
            );
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 },
            );
        }

        // Generate JWT
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error("JWT_SECRET is not defined");
            return NextResponse.json(
                { message: "Server configuration error" },
                { status: 500 },
            );
        }

        const token = jwt.sign(
            { userId: user._id, identifier: user.identifier },
            JWT_SECRET,
            { expiresIn: "15m" },
        );

        const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "7d",
        });

        // Save active token and refresh token in DB
        user.active_token = token;
        user.refresh_token = refreshToken;
        await user.save();

        const response = NextResponse.json(
            {
                message: "Signed in successfully",
                accessToken: token,
                user: {
                    id: user._id,
                    name: user.name,
                    identifier: user.identifier,
                },
            },
            { status: 200 },
        );

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        return response;
    } catch (error: any) {
        console.error("Signin error:", error);
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}

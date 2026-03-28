/**
 * API Route: /api/auth/refresh
 * Description: Exchanges a valid HTTP-Only refresh token cookie for a new 15-minute access token.
 * Method: POST
 * Access: Public (Cookie-based)
 */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { message: "Refresh token required" },
                { status: 401 },
            );
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return NextResponse.json(
                { message: "Server configuration error" },
                { status: 500 },
            );
        }

        // Verify the refresh token cryptographically
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, JWT_SECRET) as {
                userId: string;
            };
        } catch (err) {
            return NextResponse.json(
                { message: "Invalid or expired refresh token" },
                { status: 401 },
            );
        }

        await dbConnect();
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 },
            );
        }

        // Verify this refresh token is the one active in the database
        if (user.refresh_token !== refreshToken) {
            return NextResponse.json(
                { message: "Invalid refresh token session" },
                { status: 401 },
            );
        }

        // Generate a new short-lived access token
        const newToken = jwt.sign(
            { userId: user._id, identifier: user.identifier },
            JWT_SECRET,
            { expiresIn: "15m" },
        );

        user.active_token = newToken;
        await user.save();

        return NextResponse.json({ accessToken: newToken }, { status: 200 });
    } catch (error: any) {
        console.error("Refresh error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}

/**
 * API Route: /api/auth/signout
 * Description: Invalidates the current session by clearing active tokens from DB and deleting the refresh cookie.
 * Method: POST
 * Access: Protected (Requires Valid Access Token)
 */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 },
            );
        }

        const token = authHeader.split(" ")[1];

        await dbConnect();

        // Find user with this token and clear it
        const user = await User.findOne({ active_token: token });

        if (user) {
            user.active_token = null;
            user.refresh_token = null;
            await user.save();
        }

        const response = NextResponse.json(
            { message: "Signed out successfully" },
            { status: 200 },
        );

        response.cookies.set("refreshToken", "", {
            maxAge: 0,
            path: "/",
        });

        return response;
    } catch (error: any) {
        console.error("Signout error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}

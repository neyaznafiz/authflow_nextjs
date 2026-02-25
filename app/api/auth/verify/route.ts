import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const token = authHeader.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            return NextResponse.json(
                { message: "Server configuration error" },
                { status: 500 },
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        await dbConnect();
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 },
            );
        }

        // Generate a new token for auto-renewal
        const newToken = jwt.sign(
            { userId: user._id, identifier: user.identifier },
            JWT_SECRET,
            { expiresIn: "1d" },
        );

        return NextResponse.json(
            { user, accessToken: newToken },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Token verification error:", error);
        return NextResponse.json(
            { message: "Invalid or expired token" },
            { status: 401 },
        );
    }
}

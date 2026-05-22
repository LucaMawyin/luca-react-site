
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { ChangePasswordBody, User } from "@/lib/types";

export async function POST(request: Request){
    try {

        // Require session to proceed
        const session = await requireSession();

        const {
            currentPassword,
            newPassword
        } = await request.json() as ChangePasswordBody;

        const db = await getDB();

        // Getting password
        const user = await db
            .prepare(
                "SELECT password FROM users WHERE id = ?"
            )
            .bind(session.user_id)
            .first<User>();

        // User not found
        if (!user){
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Make sure user entered their password
        const valid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        // Wrong password
        if (!valid){
            return NextResponse.json(
                { error: "Current password incorrect" },
                { status: 401 }
            );
        }

        // Updating password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await db
            .prepare(
                "UPDATE users SET password = ? WHERE id = ?"
            )
            .bind(hashedPassword, session.user_id)
            .run();

        return NextResponse.json({
            success: true
        });

    } catch {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
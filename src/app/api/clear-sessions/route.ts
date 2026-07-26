import { validateSession } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {

    const session = await validateSession();

    // Authenticate before proceeding
    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const db = await getDB();

    // Delete all sessions from database
    await db.prepare(`
        DELETE FROM sessions
        WHERE token != ?
    `)
    .bind(session.token)
    .run();
    revalidateTag("projects","default");

    return NextResponse.json({ success: true });
}
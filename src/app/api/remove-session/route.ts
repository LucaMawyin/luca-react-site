import { validateSession } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const session = await validateSession();

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { id } = await request.json() as any;

    const db = await getDB();

    // Prevent deleting current session
    if (id === session.id) {
        return NextResponse.json(
            { error: "Cannot remove current session" },
            { status: 400 }
        );
    }

    await db.prepare(`
        DELETE FROM sessions
        WHERE id = ?
    `)
    .bind(id)
    .run();

    return NextResponse.json({
        success: true,
    });
}
import { getDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    // Verify secret
    const auth = request.headers.get("authorization");

    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const db = await getDB();

    await db.prepare(`
        DELETE FROM sessions
        WHERE expires_at < datetime('now')
    `).run();

    return NextResponse.json({ success: true });
}
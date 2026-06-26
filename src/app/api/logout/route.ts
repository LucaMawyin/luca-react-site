import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDB } from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function POST() {

    // Get session token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    const db = await getDB();

    // Delete session from database if token exists
    if (token) {
        await db.prepare(`
            DELETE FROM sessions WHERE token = ?
        `).bind(token).run();
        revalidateTag("projects","default");
    }

    const res = NextResponse.json({ success: true });

    res.cookies.set("session", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    return res;
}
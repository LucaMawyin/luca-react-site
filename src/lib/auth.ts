import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getDB } from "@/lib/db";
import { Session } from "@/lib/types";
import { cache } from "react";


export const validateSession = cache(async () => {

    const db = await getDB();

    // Delete all sessions that are older than current date
    await db.prepare(`
        DELETE FROM sessions
        WHERE expires_at < ?
    `)
    .bind(new Date().toISOString())
    .run();
    
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return null;

    // Now check for active token
    const session = await db.prepare(`
        SELECT * FROM sessions WHERE token = ?
    `).bind(token).first<Session>();

    if (!session) return null;

    return session;
});


export async function requireSession() {
    const session = await validateSession();

    if (!session) {
        redirect("/login");
    }

    return session;
}
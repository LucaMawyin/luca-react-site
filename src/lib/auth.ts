import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getDB } from "@/lib/db";
import { Session } from "@/lib/types";


export async function validateSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return null;

    const db = await getDB();

    const session = await db.prepare(`
        SELECT * FROM sessions WHERE token = ?
    `).bind(token).first<Session>();

    if (!session) return null;

    const expiresAt = new Date(session.expires_at);

    if (expiresAt < new Date()){
        await db.prepare(`
            DELETE FROM sessions
            WHERE token = ?
        `).bind(token).run()

        return null;
    }

    return session;
}


export async function requireSession() {
    const session = await validateSession();

    if (!session) {
        redirect("/login");
    }

    return session;
}
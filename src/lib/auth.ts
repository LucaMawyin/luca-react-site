import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getDB } from "@/lib/db";
import { Session } from "@/lib/types";
import { cache } from "react";

export const validateSession = cache(async () => {

    const db = await getDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    // No token
    if (!token) return null;

    // Check for active token
    const session = await db.prepare(`
        SELECT * 
        FROM sessions 
        WHERE token = ?
        AND expires_at > DATETIME('now')
    `)
    .bind(token)
    .first<Session>();

    return session ?? null;
});


export async function requireSession() {
    const session = await validateSession();

    if (!session) {
        redirect("/login");
    }

    return session;
}

export async function getActiveSessions(){
    const session = await requireSession();

    // Authenticate before proceeding
    if (!session) {
        redirect("/login");
    }

    const db = await getDB();

    const activeSessions = await db.prepare(`
        SELECT * 
        FROM sessions
        WHERE expires_at > DATETIME('now')
    `)
    .run() as { results : Session[]};

    return {
        currentSession: session,
        activeSessions: activeSessions.results,
    };
}
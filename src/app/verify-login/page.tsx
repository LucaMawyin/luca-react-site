import { validateSession } from "@/lib/auth";
import VerifyLoginClient from "./VerifyLoginClient";
import { redirect } from "next/navigation";
import { getDB } from "@/lib/db";
import { LoginVerification } from "@/lib/types";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ 
        attempt?: string;
        serial?: string; 
    }>
}) {
    const session = await validateSession();

    if (session) {
        redirect("/");
    }

    const { attempt, serial } = await searchParams;

    if (!attempt && !serial) {
        redirect("/login");
    }

    const db = await getDB();

    let verification: Pick<LoginVerification, "type"> | null = null;

    if (attempt){
        verification = await db.prepare(`
            SELECT type
            FROM login_verifications
            WHERE id = ? 
            AND type = 'login'
            AND expires_at > datetime('now')
        `)
        .bind(attempt)
        .first() as Pick<LoginVerification, "type"> | null;
    }

    if (!verification && serial) {
        verification = await db.prepare(`
            SELECT type
            FROM login_verifications
            WHERE serial = ?
            AND type = 'unlock'
            AND expires_at > datetime('now')
        `)
        .bind(serial)
        .first() as Pick<LoginVerification, "type"> | null;
    }

    if (!verification) {
        redirect("/login");
    }

    return <VerifyLoginClient type={verification.type}/>;
}
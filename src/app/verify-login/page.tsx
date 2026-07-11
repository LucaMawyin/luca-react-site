import { validateSession } from "@/lib/auth";
import VerifyLoginClient from "./VerifyLoginClient";
import { redirect } from "next/navigation";
import { getDB } from "@/lib/db";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ attempt?: string }>
}) {
    const session = await validateSession();

    if (session) {
        redirect("/");
    }

    const { attempt } = await searchParams;

    if (!attempt) {
        redirect("/login");
    }

    const db = await getDB();

    const verification = await db
        .prepare(`
            SELECT id
            FROM login_verifications
            WHERE id = ?
            AND expires_at > datetime('now')
        `)
        .bind(attempt)
        .first();

    if (!verification) {
        redirect("/login");
    }

    return <VerifyLoginClient />;
}
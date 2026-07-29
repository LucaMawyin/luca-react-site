import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { VerifyLoginBody } from "@/lib/types";
import crypto from "crypto";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
    try {
        const { code, serial } = await request.json() as VerifyLoginBody;

        if (!code) {
            return NextResponse.json(
                { error: "Missing token" },
                { status: 400 }
            );
        }

        const db = await getDB();

        let record;
        
        if (serial) {
            record = await db.prepare(`
                SELECT user_id, ip_address, geo, user_agent
                FROM login_verifications
                WHERE token = ?
                AND serial = ?
                AND type = 'unlock'
                AND expires_at > datetime('now')
            `)
            .bind(code, serial)
            .first();
        }

        else{
            record = await db.prepare(`
                SELECT user_id, ip_address, geo, user_agent, type
                FROM login_verifications
                WHERE token = ?
                AND type = 'login'
                AND expires_at > datetime('now')
            `)
            .bind(code)
            .first();
        }

        if (!record) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Unlocking 
        if (record.type === "unlock"){
            const sessionToken = crypto.randomUUID();

            await db.batch([
                db.prepare(`
                    UPDATE users
                    SET 
                        failed_attempts = 0,
                        locked_until = NULL
                    WHERE id = ?
                `)
                .bind(record.user_id),

                db.prepare(`
                    INSERT INTO sessions
                    (token, user_id, expires_at, ip_address, geo, user_agent)
                    VALUES (?, ?, datetime('now', '+${process.env.SESSION_DURATION_DAYS} days'), ?, ?, ?)
                `)
                .bind(
                    sessionToken,
                    record.user_id,
                    record.ip_address,
                    record.geo,
                    record.user_agent
                ),

                db.prepare(`
                    DELETE FROM login_verifications
                    WHERE token = ?
                    AND type = 'unlock'
                `)
                .bind(code)
            ]);

            revalidateTag("projects", "default");

            const res = NextResponse.json({
                success: true,
                status: "account_unlocked"
            });

            const sessionDurationDays = Number(process.env.SESSION_DURATION_DAYS);

            res.cookies.set("session", sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * sessionDurationDays,
            });

            return res;
        }

        // Update failed attempts, create session, and delete login code
        const sessionToken = crypto.randomUUID();
        await db.batch([
            db.prepare(`
                UPDATE users
                SET 
                    failed_attempts = 0,
                    locked_until = NULL
                WHERE id = ?
            `)
            .bind(record.user_id),

            db.prepare(`
                INSERT INTO sessions
                (token, user_id, expires_at, ip_address, geo, user_agent)
                VALUES (?, ?, datetime('now', '+${process.env.SESSION_DURATION_DAYS} days'), ?, ?, ?)
            `)
            .bind(
                sessionToken,
                record.user_id,
                record.ip_address,
                record.geo,
                record.user_agent
            ),

            db.prepare(`
                DELETE FROM login_verifications
                WHERE token = ?
                AND type = 'login'
            `)
            .bind(code)
        ])

        revalidateTag("projects","default");

        const res = NextResponse.json({ success: true });

        const sessionDurationDays = Number(process.env.SESSION_DURATION_DAYS);
        res.cookies.set("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * sessionDurationDays,
        });

        return res;

    } catch (err) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

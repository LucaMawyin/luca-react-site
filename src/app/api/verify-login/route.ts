import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { LoginVerification, VerifyLoginBody } from "@/lib/types";
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

        let record: LoginVerification | null = null;
        
        // Serial implies we are unlocking
        if (serial) {

            record = await getLoginVerification(
                code,
                "unlock",
                serial
            );
        }

        // Logging in
        else{
            record = await getLoginVerification(
                code,
                "login"
            );
        }

        if (!record) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Creating session
        const res = await createSession(
            code,
            record.type,
            record.user_id,
            record.ip_address,
            record.geo,
            record.user_agent
        );

        return res;

    } catch (err) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

async function createSession(
    code: string,
    type: "login" | "unlock",
    userID : number, 
    userIP: string, 
    userGeo: string, 
    userAgent: string
){

    const db = await getDB();

    const sessionToken = crypto.randomUUID();
    await db.batch([

        // update failed attempts
        db.prepare(`
            UPDATE users
            SET 
                failed_attempts = 0,
                locked_until = NULL
            WHERE id = ?
        `)
        .bind(userID),

        // Create session
        db.prepare(`
            INSERT INTO sessions
            (token, user_id, expires_at, ip_address, geo, user_agent)
            VALUES (?, ?, datetime('now', '+${process.env.SESSION_DURATION_DAYS} days'), ?, ?, ?)
        `)
        .bind(
            sessionToken,
            userID,
            userIP,
            userGeo,
            userAgent
        ),

        // Remove verification code from db
        db.prepare(`
            DELETE FROM login_verifications
            WHERE token = ?
            AND type = ?
        `)
        .bind(code, type)
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
}

async function getLoginVerification(
    code : string,
    type: "login" | "unlock",
    serial ?: string,
): Promise<LoginVerification | null>{

    const db = await getDB();

    const query = `
        SELECT user_id, ip_address, geo, user_agent, type
        FROM login_verifications
        WHERE token = ?
        ${type === "unlock" ? "AND serial = ?" : ""}
        AND type = ?
        AND expires_at > datetime('now')
    `;
    
    const params = type === "unlock"
        ? [code, serial, type]
        : [code, type];

    const record = await db.prepare(query)
        .bind(...params)
        .first<LoginVerification>();

    return record;
}
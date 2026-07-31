import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDB } from "@/lib/db";
import { User, LoginBody } from "@/lib/types";
import { Resend } from "resend";


export async function POST(request: Request) {
    try {

        // User IP
        const userIP =
            request.headers.get('CF-Connecting-IP') ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";

        // User agent
        const userAgent = request.headers.get("User-Agent") || "unknown";

        // User geolocation
        const geo = await getGeoFromIp(userIP);

        const { email, password } = (await request.json()) as LoginBody;

        // No email or password provided
        if (!email || !password) {
            return NextResponse.json({
                status: "error",
                error: "Missing credentials",
            }, { status: 400 });
        }

        const db = await getDB();

        // Delete old verifications
        await db.prepare(`
            DELETE FROM login_verifications
            WHERE expires_at <= datetime('now')
        `).run();

        // Find user by email
        const user = (await db
            .prepare("SELECT * FROM users WHERE email = ?")
            .bind(email)
            .first()) as User | null;

        if (!user) {
            return NextResponse.json(
                {
                status: "error",
                error: "Invalid credentials",
                },
                { status: 401 }
            );
        }

        // Check if account is locked
        if ( user.locked_until && new Date(user.locked_until) > new Date()){

            // Check if there is still an active unlock code
            const existingUnlock = await db.prepare(`
                SELECT id 
                FROM login_verifications
                WHERE user_id = ?
                AND type = 'unlock'
                AND expires_at > datetime('now')
            `)
            .bind(user.id)
            .first();

            // Initialize new unlock code
            if (!existingUnlock) {

                // Create new unlock code
                const unlockCode = crypto
                    .randomInt(100000, 999999)
                    .toString();

                // Create new serial
                const serial = crypto.randomUUID();

                createNewUnlock(
                    user.id,
                    userIP,
                    geo,
                    userAgent,
                    unlockCode,
                    serial
                )

                await sendUnlockEmail(
                    user.email,
                    unlockCode,
                    serial,
                    userIP,
                    geo,
                    userAgent
                );
            }

            return NextResponse.json(
                {
                    status: "account_locked",
                    error: "Account locked. Check your email."
                },
                {
                    status: 403
                }
            );
        }

        const isValid = await bcrypt.compare(password, user.password);

        // Incorrect password
        if (!isValid) {

            const failedAttempts = user.failed_attempts + 1;

            // Lock account & create new unlock code
            if (failedAttempts >= 3){
                await db.prepare(`
                    UPDATE users
                    SET 
                        failed_attempts = ?,
                        locked_until = datetime('now', '+24 hours')
                    WHERE id = ?
                `)
                .bind(
                    failedAttempts,
                    user.id
                )
                .run();
                
                const unlockCode = crypto
                    .randomInt(100000, 999999)
                    .toString();

                const serial = crypto.randomUUID();

                await createNewUnlock(
                    user.id,
                    userIP,
                    geo,
                    userAgent,
                    unlockCode,
                    serial
                );

                await sendUnlockEmail(
                    user.email,
                    unlockCode,
                    serial,
                    userIP,
                    geo,
                    userAgent
                );

                return NextResponse.json(
                    {
                        status: "account_locked",
                        error: "Account locked. Check your email."
                    },
                    {
                        status: 403
                    }
                );
            }

            // Update failed attempts
            await db.prepare(`
                UPDATE users
                SET failed_attempts = ?
                WHERE id = ?
            `)
            .bind(
                failedAttempts,
                user.id
            )
            .run();

            return NextResponse.json(
                {
                    status: "error",
                    error: "Invalid credentials",
                },
                { 
                    status: 401
                }
            );
        }

        // Deleting old verifications under user id
        await db.prepare(`
            DELETE FROM login_verifications
            WHERE user_id = ?
        `).bind(user.id).run();

        // Verification code
        const verificationCode = crypto
            .randomInt(100000, 999999)
            .toString();

        // Login token to db
        const result = await db.prepare(`
            INSERT INTO login_verifications
            (user_id, token, expires_at, ip_address, geo, user_agent, type)
            VALUES (?, ?, datetime('now', '+10 minutes'), ?, ?, ?, 'login')
        `)
        .bind(
            user.id,
            verificationCode,
            userIP,
            JSON.stringify(geo),
            userAgent
        )
        .run();

        // Verification email
        await sendVerificationEmail(
            email,
            verificationCode,
            userIP,
            geo,
            userAgent
        );

        return NextResponse.json({
            status: "verification_required",
            attemptId: result.meta.last_row_id,
        });
    } 
  
    // Error
    catch (err) {
        return NextResponse.json(
            { 
                error: "Server Error",
                details: err instanceof Error ? err.message : String(err)
            },
            { 
                status: 500 
            }
        );
    }
}

async function createNewUnlock(
    userId : number,
    userIP : string,
    geo: any,
    userAgent : string,
    unlockCode : string,
    serial : string
){

    const db = await getDB();

    // Delete old verification code
    await db.prepare(`
        DELETE FROM login_verifications
        WHERE user_id = ?
        AND type = 'unlock'
    `)
    .bind(userId)
    .run();

    await db.prepare(`
        INSERT INTO login_verifications
        (user_id, token, serial, expires_at, ip_address, geo, user_agent, type)
        VALUES (?, ?, ?, datetime('now', '+10 minutes'), ?, ?, ?, 'unlock')
    `)
    .bind(
        userId,
        unlockCode,
        serial,
        userIP,
        JSON.stringify(geo),
        userAgent
    )
    .run();
}

async function getGeoFromIp(ip: string) {
    const token = process.env.IPINFO_KEY;

    if (!token || ip === "unknown") return null;

    try {
        const res = await fetch(
            `https://ipinfo.io/${ip}?token=${token}`
        );
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        return err;
    }
}

async function sendVerificationEmail(
    email: string,
    code: string,
    ip: string,
    geo: any,
    userAgent: string
) {
    const resend = new Resend(process.env.RESEND_KEY);
        
    await resend.emails.send({
        from: "Luca Mawyin <security@lucamawyin.com>",
        to: email,
        subject: "Your Login Verification Code",
        html: `
            <div 
                style="
                    font-family: Arial, sans-serif; 
                    max-width: 600px; 
                    margin: auto; 
                    padding: 20px; 
                    color: #111;
                "
            >
                
                <h2 style="margin-bottom: 10px;">
                    Verify Your Login
                </h2>

                <p>
                    A login attempt was made on your account.
                </p>

                <div
                    style="
                        margin: 30px 0;
                        padding: 20px;
                        text-align: center;
                        background: #f4f4f4;
                        border-radius: 10px;
                    "
                >
                    <p style="margin: 0; font-size: 14px; color: #666;">
                        Your verification code
                    </p>

                    <h1
                        style="
                            margin: 10px 0 0;
                            font-size: 42px;
                            letter-spacing: 8px;
                        "
                    >
                        ${code}
                    </h1>
                </div>

                <h3 style="margin-top: 30px;">
                    Login Details
                </h3>

                <p><strong>IP Address:</strong> ${ip}</p>
                <p><strong>Device:</strong> ${userAgent}</p>
                <p><strong>Country:</strong> ${geo?.country || "Unknown"}</p>
                <p><strong>Region:</strong> ${geo?.region || "Unknown"}</p>
                <p><strong>City:</strong> ${geo?.city || "Unknown"}</p>
                
                <p style="margin-top: 30px;">
                    This code expires in 10 minutes.
                </p>

                <p style="color: #666; font-size: 14px;">
                    If this wasn't you, you can safely ignore this email.
                </p>

            </div>
        `,
    });
}

async function sendUnlockEmail(
    email: string,
    code: string,
    serial: string,
    ip: string,
    geo: any,
    userAgent: string
){
    const resend = new Resend(process.env.RESEND_KEY);

    const unlockLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-login?serial=${serial}`;

    await resend.emails.send({
        from: "Luca Mawyin <security@lucamawyin.com>",
        to: email,
        subject: "Your Account Has Been Locked",
        html: `
            <div
                style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    color: #111;
                "
            >
                <h2>
                    Account Locked
                </h2>

                <p>
                    Your account has been temporarily locked after
                    multiple failed login attempts.
                </p>

                <p>
                    If this was you, use the link below to unlock your account.
                </p>

                <div
                    style="
                        margin: 30px 0;
                        text-align: center;
                    "
                >
                    <a
                        href="${unlockLink}"
                        style="
                            display: inline-block;
                            padding: 12px 24px;
                            background: #111;
                            color: #fff;
                            text-decoration: none;
                            border-radius: 8px;
                        "
                    >
                        Unlock Account
                    </a>
                </div>

                <p>
                    After opening the link, enter the verification code below:
                </p>

                <div
                    style="
                        margin: 30px 0;
                        padding: 20px;
                        text-align: center;
                        background: #f4f4f4;
                        border-radius: 10px;
                    "
                >
                    <p
                        style="
                            margin: 0;
                            font-size: 14px;
                            color: #666;
                        "
                    >
                        Your unlock code
                    </p>

                    <h1
                        style="
                            margin: 10px 0 0;
                            font-size: 42px;
                            letter-spacing: 8px;
                        "
                    >
                        ${code}
                    </h1>
                </div>

                <h3>
                    Login Attempt Details
                </h3>

                <p><strong>IP Address:</strong> ${ip}</p>
                <p><strong>Device:</strong> ${userAgent}</p>
                <p><strong>Country:</strong> ${geo?.country || "Unknown"}</p>
                <p><strong>Region:</strong> ${geo?.region || "Unknown"}</p>
                <p><strong>City:</strong> ${geo?.city || "Unknown"}</p>

                <p>
                    This unlock code expires in 10 minutes.
                </p>

                <p style="color:#666;font-size:14px;">
                    If this was not you, someone may have attempted to access
                    your account. Change your password after regaining access.
                </p>
            </div>
        `,
    });
}
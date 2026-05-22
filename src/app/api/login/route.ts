import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDB } from "@/lib/db";
import { User, LoginBody } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as LoginBody;

    if (!email || !password) {
      return NextResponse.json({
        status: "error",
        error: "Missing credentials",
      }, { status: 400 });
    }

    const db = await getDB();

    // -------------------------
    // Find user
    // -------------------------
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

    // -------------------------
    // Check password
    // -------------------------
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        {
          status: "error",
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // -------------------------
    // Create session
    // -------------------------
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 day session

    await db
      .prepare(`
        INSERT INTO sessions (token, user_id, expires_at)
        VALUES (?, ?, ?)
      `)
      .bind(token, user.id, expiresAt.toISOString())
      .run();

    // -------------------------
    // Set cookie
    // -------------------------
    const res = NextResponse.json({
      status: "success",
    });

    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return NextResponse.json({
      status: "error",
      error: "Server error",
    }, { status: 500 });
  }
}
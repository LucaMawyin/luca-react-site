import { validateSession } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    // Validation
    const session = await validateSession();
    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {

        const { about } = await req.json() as any;

        if (typeof about !== "string") {
            return NextResponse.json(
                { error: "Invalid input" },
                { status: 400 }
            );
        }

        // Updating
        const db = await getDB();
        await db
            .prepare("UPDATE site_content SET about = ? WHERE id = 1")
            .bind(about)
            .run();
        
        return Response.json({ success: true });
    } 
    
    catch (err) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function DELETE(req: NextRequest) {
    const session = await validateSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name } = await req.json() as any;

    if (!name) {
        return NextResponse.json(
            { error: "Missing tag name" },
            { status: 400 }
        );
    }

    const db = await getDB();

    await db
        .prepare("DELETE FROM tags WHERE name = ?")
        .bind(name.trim())
        .run();

    await db
        .prepare("UPDATE projects SET tag = NULL WHERE tag = ?")
        .bind(name)
        .run();

        return NextResponse.json({ success: true });
    } 
    
    catch (err) {
        return NextResponse.json(
            { error: "Failed to delete tag" },
            { status: 500 }
        );
    }
}
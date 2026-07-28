import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function DELETE(req: NextRequest) {
    const session = await validateSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, category } = await req.json() as {
            name : string;
            category : "project" | "status";
        };

    if (!name || !category) {
        return NextResponse.json(
            { error: "Missing tag name or category" },
            { status: 400 }
        );
    }

    const db = await getDB();

    await db
        .prepare("DELETE FROM tags WHERE name = ? and category = ?")
        .bind(name.trim(), category)
        .run();

    const column = category === "status" ? "status" : "tag";

    await db
        .prepare(`UPDATE projects SET ${column} = NULL WHERE ${column} = ?`)
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
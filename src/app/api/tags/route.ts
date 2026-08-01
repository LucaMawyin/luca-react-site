import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function DELETE(req: NextRequest) {
    const session = await validateSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, category } = await req.json() as {
            name : string;
            category: "project" | "status" | "experience";
        };

        if (!name || !category) {
            return NextResponse.json(
                { error: "Missing tag name or category" },
                { status: 400 }
            );
        }

        const db = await getDB();

        // Delete tag
        await db
            .prepare("DELETE FROM tags WHERE name = ? and category = ?")
            .bind(name.trim(), category)
            .run();

        // Determine if tag is from project or experience
        let table: "projects" | "experience";
        let column = "tag";     
        if (category === "experience") {
            table = "experience";
        } else {
            table = "projects";
            column = category === "status" ? "status" : "tag";
        }

        // Updating tag on table
        await db
            .prepare(`UPDATE ${table} SET ${column} = NULL WHERE ${column} = ?`)
            .bind(name)
            .run();

        revalidateTag(`tags:${category}`, "max");

        if (category === "project" || category === "status") {
            revalidateTag("projects", "max");
        }

        if (category === "experience") {
            revalidateTag("experience", "max");
        }

        return NextResponse.json({ success: true });
    }


    
    catch (err) {
        return NextResponse.json(
            { error: "Failed to delete tag" },
            { status: 500 }
        );
    }
}
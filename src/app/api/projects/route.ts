import { validateSession } from "@/lib/auth";
import { capitalizeNamesAndTitles } from "@/lib/capitalizeNamesAndTitles";
import { getDB } from "@/lib/db";
import { deleteFromR2, r2, uploadToR2 } from "@/lib/r2";
import { Project } from "@/lib/types";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Create/update projects
export async function POST(req: NextRequest) {
    const session = await validateSession();

    // Authenticate before proceeding
    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const formData = await req.formData();    

        // Ensure link starts with https:// if provided
        const rawLink = (formData.get("link") as string) || null;
        const link =
        rawLink
            ? (rawLink.startsWith("https://")
            ? rawLink.trim()
            : `https://${rawLink.trim()}`)
            : null;

        // Process languages and tools as comma-separated values
        const languagesRaw = (formData.get("languages") as string)?.trim();
        const languages = languagesRaw
        ? languagesRaw
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : null;

        const toolsRaw = (formData.get("tools") as string)?.trim();
        const tools = toolsRaw
        ? toolsRaw
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : null;

        const librariesRaw = (formData.get("libraries") as string)?.trim();
        const libraries = librariesRaw
        ? librariesRaw
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : null;


        // Image upload
        const image = formData.get("image") as File | null;

        const imageType =
            (formData.get("imageType") as string) ||
            (image ? image.type : null);

        // Project name, description and id (for updates)
        const id = formData.get("id") as string | null;
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;

        // Project Tag
        const rawTag = (formData.get("tag") as string) || null;
        const tag = rawTag
            ? capitalizeNamesAndTitles(rawTag.trim().toLowerCase())
            : null;
        
        // Project Tag
        const rawStatus = (formData.get("status") as string) || null;
        const status = rawStatus
            ? capitalizeNamesAndTitles(rawStatus.trim().toLowerCase())
            : null;

        const pinned = formData.get("pinned") as string;
        const hidden = formData.get("hidden") as string;
        
        const tagColour = formData.get("colour") as string | null;
        const statusColour = formData.get("status_colour") as string | null;
                
        const db = await getDB();

        // Add or update tag in db
        if (tag) {
            await db
                .prepare(`
                    INSERT INTO tags (name,category,colour)
                    VALUES (?, ?, ?)
                    ON CONFLICT(name, category) DO UPDATE SET colour = EXCLUDED.colour
                `)
                .bind(tag, "project", tagColour)
                .run();

            revalidateTag("tags:project","default");
        }

        if (status) {
            await db
                .prepare(`
                    INSERT INTO tags (name,category,colour)
                    VALUES (?, ?, ?)
                    ON CONFLICT(name, category) DO UPDATE SET colour = EXCLUDED.colour
                `)
                .bind(status,"status",statusColour)
                .run();

            revalidateTag("tags:status","default");
        }

        revalidateTag("tech","default");

        // UPDATE PROJECT
        if (id) {
            await db
                .prepare(`
                UPDATE projects
                SET name = ?,
                    description = ?,
                    link = ?,
                    languages = ?,
                    tools = ?,
                    libraries = ?,
                    tag = ?,
                    status = ?,
                    pinned = ?,
                    hidden = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                `)
                .bind(
                    name,
                    description,
                    link,

                    languages ? JSON.stringify(languages) : null,
                    tools ? JSON.stringify(tools) : null,
                    libraries ? JSON.stringify(libraries) : null,

                    tag,
                    status,

                    pinned,
                    hidden,

                    id
                )
                .run();

            revalidateTag("projects","default");

            if (image){
                await uploadToR2(image,"projects",id);
            }

            return NextResponse.json({
                success: true,
                id,
            });
        }

        // CREATE PROJECT
        const result = await db
            .prepare(`
                INSERT INTO projects
                (name, description, link, languages, tools, libraries, tag, status, pinned, hidden)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `)
            .bind(
                name,
                description,
                link,
                languages ? JSON.stringify(languages) : null,
                tools ? JSON.stringify(tools) : null,
                libraries ? JSON.stringify(libraries) : null,
                tag,
                status,
                pinned,
                hidden
            )
            .run();

        revalidateTag("projects","default");

        const newId = result.meta?.last_row_id;

        if (image){
            await uploadToR2(image,"projects",`${newId}`);
        }

        return NextResponse.json({
            success: true,
            id: newId,
        });

    } 
  
    // Create/update failed
    catch (err) {

        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}

// Delete project
export async function DELETE(req: NextRequest) {

    // Authenticate before proceeding
    const session = await validateSession();
    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {

        const db = await getDB();
        const { id } = await req.json() as Project;

        // No project id provided
        if (!id) {
            return NextResponse.json(
                { error: "Missing project id" },
                { status: 400 }
            );
        }

        const result = await db
            .prepare(`
                SELECT * 
                FROM projects
                WHERE id = ?
                AND deleted = 1
            `)
            .bind(id)
            .first<Project | null>();

        console.log(result);

        await db
            .prepare(`
                UPDATE projects 
                SET 
                    deleted = 1,
                    deleted_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `)
            .bind(id)
            .run();
        
        // deleteFromR2("projects",`${id}`)

        revalidateTag("projects","default");

        return NextResponse.json({
            success: true,
        });

    } 
    
    // Delete failed
    catch (err) {
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {

    // Authenticate before proceeding
    const session = await validateSession();
    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const db = await getDB();
        const { id } = await req.json() as any;

        await db
            .prepare(`
                UPDATE projects
                SET deleted = 0,
                    deleted_at = NULL
                WHERE id = ?
            `)
            .bind(id)
            .run();

        revalidateTag("projects", "default");

        return NextResponse.json({
            success: true,
        });

    } catch {
        return NextResponse.json(
            { error: "Failed to restore project" },
            { status: 500 }
        );
    }
}
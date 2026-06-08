import { validateSession } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { Project } from "@/lib/types";
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

    
    // Image upload
    const image = formData.get("image") as File | null;

    const imageType =
      (formData.get("imageType") as string) ||
      (image ? image.type : null);

    let imageBuffer: Buffer | null = null;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

    // Project name, description and id (for updates)
    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const tag = formData.get("tag") as string | null;


    const db = await getDB();

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
            tag = ?,
            image = CASE WHEN ? IS NOT NULL THEN ? ELSE image END,
            image_type = CASE WHEN ? IS NOT NULL THEN ? ELSE image_type END
          WHERE id = ?
        `)
        .bind(
          name,
          description,
          link,

          languages ? JSON.stringify(languages) : null,
          tools ? JSON.stringify(tools) : null,

          tag,

          imageBuffer,
          imageBuffer,

          imageType,
          imageType,

          id
        )
        .run();

      return NextResponse.json({
        success: true,
        id,
      });
    }

    // CREATE PROJECT
    const result = await db
      .prepare(`
        INSERT INTO projects
        (name, description, link, languages, tools, image, image_type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        name,
        description,
        link,
        JSON.stringify(languages),
        JSON.stringify(tools),
        imageBuffer,
        imageType?.trim() || null
      )
      .run();

    const newId = result.meta?.last_row_id;

    return NextResponse.json({
      success: true,
      id: newId,
    });

  } 
  
  // Create/update failed
  catch (err) {
    console.error("POST /projects error:", err);

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

    await db
      .prepare("DELETE FROM projects WHERE id = ?")
      .bind(id)
      .run();

    return NextResponse.json({
      success: true,
    });

  } 
  
  // Delete failed
  catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
import { validateSession } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest){
    try {
        const db = await getDB();
        const {results} = await db
        .prepare(`
            SELECT * FROM projects 
            ORDER BY created_at DESC 
            LIMIT 5
        `)
        .all();

        return NextResponse.json({
            projects: results
        });        
    }   
    
    catch (err) {
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
  const session = await validateSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();

    const id = formData.get("id") as string | null;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const rawLink = (formData.get("link") as string) || null;

    const link =
      rawLink
        ? (rawLink.startsWith("https://")
          ? rawLink.trim()
          : `https://${rawLink.trim()}`)
        : null;

    const languages =
        (formData.get("languages") as string)
            ?.split(",")
            .map((x) => x.trim())
            .filter(Boolean) ?? [];

    const tools =
        (formData.get("tools") as string)
            ?.split(",")
            .map((x) => x.trim())
            .filter(Boolean) ?? [];

    const image = formData.get("image") as File | null;

    const imageType =
      (formData.get("imageType") as string) ||
      (image ? image.type : null);

    let imageBuffer: Buffer | null = null;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

    const db = await getDB();

    // -------------------------
    // UPDATE PROJECT
    // -------------------------
    if (id) {
      await db
        .prepare(`
          UPDATE projects
          SET name = ?,
              description = ?,
              link = ?,
              languages = ?,
              tools = ?,
              image = CASE WHEN ? IS NOT NULL THEN ? ELSE image END,
              image_type = CASE WHEN ? IS NOT NULL THEN ? ELSE image_type END,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `)
        .bind(
          name,
          description,
          link,

          JSON.stringify(languages),
          JSON.stringify(tools),

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

    // -------------------------
    // CREATE PROJECT
    // -------------------------
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

  } catch (err) {
    console.error("POST /projects error:", err);

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
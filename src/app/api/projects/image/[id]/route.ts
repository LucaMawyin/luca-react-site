import { getDB } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const db = await getDB();

    const row = await db
        .prepare("SELECT image, image_type FROM projects WHERE id = ?")
        .bind(id)
        .first<{ image: any; image_type: string }>();

    if (!row?.image) {
        return new Response("Not found", { status: 404 });
    }

    const bytes = new Uint8Array(row.image);
    console.log(row.image);

    return new Response(bytes, {
        headers: {
            "Content-Type": row.image_type,
            "Cache-Control": "no-store",
        },
    });
}
import { getR2Object } from "@/lib/r2";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const image = await getR2Object(`projects/${id}`);

    if (!image) {
        return new Response("Not found", { status: 404 });
    }

    return new Response(image.body, {
        headers: {
            "Content-Type": image.contentType,
            "Cache-Control": "public, max-age=86400",
        },
    });
}
import { NextRequest } from "next/server";
import { r2 } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {

    const { id } = await context.params;
    
    const res = await r2.send(
        new GetObjectCommand({
            Bucket: process.env.CF_BUCKET_NAME!,
            Key: `projects/${id}`,
        })
    );

    if (!res.Body) {
        return new Response("Not found", { status: 404 });
    }

    const stream = res.Body as any;
    
    return new Response(stream, {
        headers: {
            "Content-Type": res.ContentType || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
}
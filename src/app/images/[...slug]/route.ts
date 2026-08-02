import { NextResponse } from "next/server";
import { getR2Object } from "@/lib/r2";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string[] }> }
) {
    try {
        const { slug } = await params;

        const key = slug.join("/");

        const object = await getR2Object(`${key}`) as any;

        // Return image
        return new NextResponse(object.body, {
            headers: {
                "Content-Type": object.contentType ?? "image/png",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });

    } 

    // Redirect to home if image doesnt exist
    catch (err) {
        return NextResponse.redirect(new URL("/404", req.url));
    }
}
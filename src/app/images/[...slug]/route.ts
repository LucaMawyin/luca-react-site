import { NextResponse } from "next/server";
import { getR2Object } from "@/lib/r2";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const object = await getR2Object(`${slug}`) as any;

        // Return image
        return new NextResponse(object.body, {
            headers: {
                "Content-Type": object.contentType ?? "image/png",
            },
        });

    } 

    // Redirect to home if image doesnt exist
    catch (err) {
        return NextResponse.redirect(new URL("/404", req.url));
    }
}
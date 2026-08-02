import { validateSession } from "@/lib/auth";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

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
        const file = formData.get("file") as File | null;
        const name = formData.get("name") as string | null;
        const type = formData.get("type") as "image" | "pdf" | null;

        // No file
        if (!file) {
            return Response.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // No Name
        if (!name) {
            return Response.json(
                { error: "No name provided" },
                { status: 400 }
            );
        }

        // No type given
        if (!type) {
            return Response.json(
                { error: "No file type provided" },
                { status: 400 }
            );
        }

        // Check if the type is valid for the given file
        if (type === "image" && !file.type.startsWith("image/")) {
            return Response.json(
                { error: "Only images allowed" },
                { status: 400 }
            );
        }

        if (type === "pdf" && file.type !== "application/pdf") {
            return Response.json(
                { error: "Only PDFs allowed" },
                { status: 400 }
            );
        }

        if (type !== "image" && type !== "pdf") {
            return Response.json(
                { error: "Invalid file type" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const key = name;


        await r2.send(
            new PutObjectCommand({
                Bucket: `${process.env.CF_BUCKET_NAME}`,
                Key: key,
                Body: buffer,
                ContentType: file.type,
            })
        );

        return Response.json({
            key,
        });

    } catch (err) {
        return Response.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
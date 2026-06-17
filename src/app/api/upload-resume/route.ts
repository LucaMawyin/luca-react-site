import { validateSession } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

        // No file
        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        // Wrong file type
        if (file.type !== "application/pdf") {
            return Response.json({ error: "Only PDFs allowed" }, { status: 400 });
        }

        // Bucket for resume PDF
        const r2 = new S3Client({
            region: "auto",
            endpoint: `https://${process.env.CF_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.CF_BUCKET_ACCESS_KEY!,
                secretAccessKey: process.env.CF_BUCKET_SECRET_ACCESS_KEY!,
            },
        });

        const buffer = Buffer.from(await file.arrayBuffer());

        const key = `resume.pdf`;

        await r2.send(
            new PutObjectCommand({
                Bucket: `${process.env.CF_BUCKET_NAME}`,
                Key: key,
                Body: buffer,
                ContentType: "application/pdf",
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
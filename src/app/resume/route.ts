import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {
    try {
        const r2 = new S3Client({
            region: "auto",
            endpoint: `https://${process.env.CF_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.CF_BUCKET_ACCESS_KEY!,
                secretAccessKey: process.env.CF_BUCKET_SECRET_ACCESS_KEY!,
            },
        });

        const key = `resume.pdf`; 
        const object = await r2.send(
            new GetObjectCommand({
                Bucket: `${process.env.CF_BUCKET_NAME}`,
                Key: key,
            })
        );

        // Not found
        if (!object.Body) {
            return new Response("Not found", { status: 404 });
        }


        // Get File
        const stream = object.Body as ReadableStream;
        return new Response(stream, {
            headers: {
                "Content-Type": "application/pdf",
            },
        });

    } catch (err) {
        console.error(err);
        return new Response("Error fetching resume", { status: 500 });
    }
}
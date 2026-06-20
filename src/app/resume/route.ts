import { r2 } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {
    try {

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
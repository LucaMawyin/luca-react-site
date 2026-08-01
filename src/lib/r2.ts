import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CF_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CF_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.CF_BUCKET_SECRET_ACCESS_KEY!,
    },
});

export async function uploadToR2(file:File, filePath:string, fileName:string){
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `${filePath}/${fileName}`;


    await r2.send(
        new PutObjectCommand({
            Bucket: `${process.env.CF_BUCKET_NAME}`,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        })
    );

    return key;
}

export async function deleteFromR2(filePath:string,fileName:string){
    await r2.send(
        new DeleteObjectCommand({
            Bucket : process.env.CF_BUCKET_NAME,
            Key: `${filePath}/${fileName}`
        })
    );
}

export async function getImageDataUrl(filePath:string, id: string) {
    const res = await r2.send(
        new GetObjectCommand({
            Bucket: process.env.CF_BUCKET_NAME!,
            Key: `${filePath}/${id}`,
        })
    );

    if (!res.Body) return null;

    const bytes = await res.Body.transformToByteArray();

    return `data:${res.ContentType || "image/jpeg"};base64,${Buffer.from(bytes).toString("base64")}`;
}
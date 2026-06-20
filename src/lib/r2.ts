import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CF_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CF_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.CF_BUCKET_SECRET_ACCESS_KEY!,
    },
});

export async function uploadToR2(file:File, path:string, name:string){
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `${path}/${name}`;


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
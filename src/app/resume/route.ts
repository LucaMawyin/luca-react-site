import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL("/resume/resume.pdf", req.url);

    const res = await fetch(url);
    const pdf = await res.arrayBuffer();

    return new NextResponse(pdf, {
        headers: {
            "Content-Type": "application/pdf",
        },
    });
}
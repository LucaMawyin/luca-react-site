import { getDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const db = await getDB();

    const { results } = await db
    .prepare("SELECT * FROM test").all();
    return NextResponse.json({
        results : results
    });
}
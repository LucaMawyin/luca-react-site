import { getDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest){
    const db = await getDB();
    const {results} = await db
    .prepare(`
        SELECT * FROM projects 
        ORDER BY created_at ASC 
        LIMIT 5
    `)
    .all();

    return NextResponse.json({
        projects: results
    });
}
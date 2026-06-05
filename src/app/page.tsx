import { validateSession } from "@/lib/auth";
import HomeClient from "./HomeClient";
import { getDB } from "@/lib/db";
import { Project } from "@/lib/types";

export default async function Home() {

    // Validate user session
    const session = await validateSession();

    // Fetching recent projects
    const db = await getDB();
    const { results } = await db
        .prepare(`
            SELECT *
            FROM projects
            ORDER BY created_at DESC
            LIMIT 5
        `)
        .all() as { results : Project[] }; 

    // Convert image buffers to base64 strings
    const projects = results.map((p) => {
        if (!p.image) return p;

        const buffer = Buffer.from(p.image as unknown as number[]);

        return {
            ...p,
            image: `data:${p.image_type};base64,${buffer.toString("base64")}`,
        };
    });

    return (
        <HomeClient 
            isLoggedIn={!!session} 
            projects={projects}
        />
    );
}
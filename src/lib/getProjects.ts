import { getDB } from "@/lib/db";
import { Project, Session, Tech } from "@/lib/types";

export default async function getProjects(session : Session) {

    // Fetching recent projects
    const db = await getDB();

    const query = session
        ? `
            SELECT *
            FROM projects
            ORDER BY pinned DESC, created_at DESC
          `
        : `
            SELECT *
            FROM projects
            ORDER BY pinned DESC, created_at DESC
          `;


    const { results } = await db
        .prepare(query)
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

    return projects;
}

export async function getTech(): Promise<Tech[]>{
    const db = await getDB();
    
    // All tech from tech
    const techRes  = await db
        .prepare(`SELECT * FROM tech`)
        .all() as { results : Tech[] };
    
    // All tech from projects
    const projectRes = await db
        .prepare(`SELECT languages, tools, libraries FROM projects`)
        .all() as {
            results: { languages: string; tools: string; libraries: string | null }[];
        };

    const techSet = new Set<Tech>();
    let largestId = 0;

    // Add techRes to techSet
    techRes.results.forEach((result) => {
        largestId = result.id > largestId ? result.id : largestId;
        techSet.add(result);
    });

    // Adding all languages and tools to techSet
    projectRes.results.forEach((result) => {
        const toolArr: string[] = JSON.parse(result.tools || "[]");
        const languageArr: string[] = JSON.parse(result.languages || "[]");
        const libArr: string[] = JSON.parse(result.libraries || "[]");

        // Languages
        languageArr.forEach((language) => {
            largestId++;

            // Creating temp tech object
            const temp : Tech = {
                id: largestId, 
                name:language, 
                category:"languages"
            };

            const exists = [...techSet].some(t => t.name === temp.name);
            if (!exists) techSet.add(temp);
        });

        toolArr.forEach((tool) => {
            largestId++;

            // Creating temp tech object
            const temp : Tech = {
                id: largestId, 
                name:tool, 
                category:"tools"
            };

            const exists = [...techSet].some(t => t.name === temp.name);
            if (!exists) techSet.add(temp);
        });

        // Libraries
        libArr.forEach((lib) => {
            largestId++;

            // Creating temp tech object
            const temp : Tech = {
                id: largestId, 
                name:lib, 
                category:"libraries"
            };

            const exists = [...techSet].some(t => t.name === temp.name);
            if (!exists) techSet.add(temp);
        });

    });
    
    // merge everything
    return Array.from(techSet);

}
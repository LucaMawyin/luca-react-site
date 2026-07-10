import { getDB } from "@/lib/db";
import { Project, Session, Tech } from "@/lib/types";
import { unstable_cache } from "next/cache";
import { getImageDataUrl } from "./r2";

const getCachedProjects = (isLoggedIn: boolean) =>
    unstable_cache(
        async (): Promise<Project[]> => {
            const db = await getDB();

            const { results } = await db
                .prepare(`
                    SELECT *
                    FROM projects
                    ${isLoggedIn ? "" : "WHERE hidden = FALSE"}
                    ORDER BY 
                        pinned DESC,
                        CASE WHEN pinned = 1 THEN updated_at
                        ELSE created_at END DESC
                `)
                .all() as { results: Project[] };

            const projects = await Promise.all(
                results.map(async (p) => {
                    const image = await getImageDataUrl(String(p.id));

                    return {
                        ...p,
                        image,
                    };
                })
            );

            return projects;
        },
        [`projects-${isLoggedIn ? "private" : "public"}`],
        {
            tags: ["projects"],
        }
    )();


export function getProjects(session: Session) {
    return getCachedProjects(!!session);
}


export const getTech = unstable_cache( 
        
    async() : Promise<Tech[]> => {

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
        (projectRes?.results ?? []).forEach((result) => {
            const toolArr: string[] = JSON.parse(result.tools || "[]");
            const languageArr: string[] = JSON.parse(result.languages || "[]");
            const libArr: string[] = JSON.parse(result.libraries || "[]");

            // Languages
            (languageArr ?? []).forEach((language) => {
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

            (toolArr ?? []).forEach((tool) => {
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
            (libArr ?? []).forEach((lib) => {
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
    },
    ["tech"],
    {
        tags: ["tech"],
    }
);

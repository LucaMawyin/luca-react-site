import { getDB } from "@/lib/db";
import { Project, Session, Tech } from "@/lib/types";

const getProjectsPublic = async (): Promise<Project[]> => {
    return fetchProjects(false);
};

const getProjectsPrivate = async (): Promise<Project[]> => {
    return fetchProjects(true);
};

async function fetchProjects(isLoggedIn: boolean): Promise<Project[]> {

    console.log("FETCH PROJECTS FROM DB");
    const db = await getDB();
    
    const { results } = await db
        .prepare(`
            SELECT 
                p.*, 
                project_tag.name AS tag, 
                project_tag.colour AS colour,
                status_tag.name AS status,
                status_tag.colour AS status_colour
            FROM projects p
            LEFT JOIN tags project_tag
                ON p.tag = project_tag.name 
                AND project_tag.category = 'project'
            LEFT JOIN tags status_tag
                ON p.status = status_tag.name
                AND status_tag.category = 'status'
            
            ${isLoggedIn ? "" : "WHERE deleted = FALSE AND p.hidden = FALSE"}
            ORDER BY 
                p.pinned DESC,
                CASE WHEN p.pinned = 1 THEN p.updated_at END ASC,
                CASE WHEN p.pinned = 0 THEN p.created_at END DESC
        `)
        .all() as { results: Project[] };

    return results.map((p) => ({
        ...p,
        image: `/images/projects/${p.id}?v=${p.updated_at}`,
    }));
}


export function getProjects(session: Session) {
    return session ? getProjectsPrivate() : getProjectsPublic();
}

export const getTech = async() : Promise<Tech[]> => {

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
};
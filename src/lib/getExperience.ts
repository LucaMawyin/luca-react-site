import { getDB } from "@/lib/db";
import { Experience } from "@/lib/types";
import { unstable_cache } from "next/cache";

export const getExperience = unstable_cache(
    async() => {
        const db = await getDB();

        const { results } = await db
            .prepare(`
                SELECT * 
                FROM experience
                ORDER BY start_date DESC
            `)
            .all() as { results  : Experience[]}

            return results;        
    },
    ["experience"],
    {
        tags:["experience"],
    }
);
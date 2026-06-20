import { getDB } from "@/lib/db";
import { Experience } from "@/lib/types";

export default async function getExperience(){
    const db = await getDB();

    const { results } = await db
        .prepare(`
            SELECT * 
            FROM experience
            ORDER BY start_date DESC
        `)
        .all() as { results  : Experience[]}

        return results;
}
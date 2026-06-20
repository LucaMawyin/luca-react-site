
import { unstable_cache } from "next/cache";
import { getDB } from "./db";

type SiteContentRow = {
    about: string;
};

export function getContent(): Promise<string>{
    return unstable_cache(
        async () => {
            const db = await getDB();
            const result = await db
                .prepare("SELECT * FROM site_content LIMIT 1")
                .all<SiteContentRow>();

            const row = result.results?.[0];

            return row?.about ?? "";    
        },
        [`about`],
        {
            revalidate:3600,
            tags: [`about`]
        }
    )();
}
import { getDB } from "./db";

type SiteContentRow = {
    about: string;
};

export async function getContent(): Promise<string> {
    const db = await getDB();

    const result = await db
        .prepare("SELECT * FROM site_content LIMIT 1")
        .all<SiteContentRow>();

    const row = result.results?.[0];

    return row?.about ?? "";
}